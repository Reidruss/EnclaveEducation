import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Use the installed compiler on Node builds without native TypeScript support.
async function moduleUrl(path, replacements = {}) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8');
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, to);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}
const contractsUrl = await moduleUrl('../../../packages/contracts/src/index.ts');
const { EnclaveApi } = await import(contractsUrl);
const { enrollStudent, restoreEnrollment } = await import(
  await moduleUrl('../src/enrollment.ts', {
    '@enclave/contracts': contractsUrl,
  })
);

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const api = new EnclaveApi('http://example.test');
const key = 'session';
const enrollment = {
  studentName: 'Test student',
  course: { id: 'course-1', code: 'CS 201', name: 'Data structures' },
  expiresAt: '2030-01-01T00:00:00Z',
};
function storage(token) {
  const entries = new Map(token ? [[key, token]] : []);
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: (key) => entries.delete(key),
  };
}

test('first launch shows code entry without an API request', async () => {
  globalThis.fetch = () => {
    throw new Error('Unexpected API call');
  };
  assert.equal(await restoreEnrollment(api, storage(), key), null);
});

test('joining trims the code and saves only the returned token', async () => {
  const saved = storage();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'http://example.test/api/student/enrollment');
    assert.deepEqual(JSON.parse(options.body), { code: 'STUDENT-123' });
    return Response.json({ token: 'opaque-session-token', enrollment });
  };
  assert.deepEqual(await enrollStudent(api, saved, key, ' STUDENT-123 '), enrollment);
  assert.equal(saved.getItem(key), 'opaque-session-token');
});

test('reopening validates the saved session without resubmitting the code', async () => {
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.method, 'GET');
    assert.equal(options.headers.Authorization, 'Bearer saved-token');
    assert.equal(options.body, undefined);
    return Response.json(enrollment);
  };
  assert.deepEqual(await restoreEnrollment(api, storage('saved-token'), key), enrollment);
});

for (const status of [401, 403, 410]) {
  test(`HTTP ${status} clears the session and returns to code entry`, async () => {
    const saved = storage('ended-session');
    globalThis.fetch = async () => Response.json({ detail: 'Enrollment ended' }, { status });
    assert.equal(await restoreEnrollment(api, saved, key), null);
    assert.equal(saved.getItem(key), null);
  });
}

for (const failure of ['offline', 'server error']) {
  test(`${failure} keeps the saved session for retry`, async () => {
    const saved = storage('saved-token');
    globalThis.fetch = async () => {
      if (failure === 'offline') throw new TypeError('Failed to fetch');
      return Response.json({ detail: 'Unavailable' }, { status: 503 });
    };
    await assert.rejects(restoreEnrollment(api, saved, key));
    assert.equal(saved.getItem(key), 'saved-token');
  });
}

test('invalid codes do not save a session', async () => {
  const saved = storage();
  globalThis.fetch = async () => Response.json({ detail: 'Unknown student code' }, { status: 400 });
  await assert.rejects(enrollStudent(api, saved, key, 'wrong'), /Unknown student code/);
  assert.equal(saved.getItem(key), null);
});

test('storage failures do not report successful enrollment', async () => {
  globalThis.fetch = async () => Response.json({ token: 'token', enrollment });
  const saved = storage();
  saved.setItem = () => {
    throw new Error('Storage unavailable');
  };
  await assert.rejects(enrollStudent(api, saved, key, 'code'), /Unable to save your sign-in/);
});
