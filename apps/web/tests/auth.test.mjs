import assert from 'node:assert/strict';
import test from 'node:test';
import { Server } from '../.svelte-kit/output/server/index.js';
import { manifest } from '../.svelte-kit/output/server/manifest.js';

// Exercise the built SvelteKit routes and real Supabase SDK without a live project.
test('server-side email login, verified sessions, and sign-out', async () => {
  const server = new Server(manifest);
  const origin = 'https://enclave.example.test';
  const authOrigin = 'https://project.example.test';
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'instructor@example.test',
    aud: 'authenticated', role: 'authenticated',
    app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString()
  };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({
    sub: user.id, aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600
  })}.test-signature`;
  let revoked = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, options) => {
    const request = new Request(input, options);
    const url = new URL(request.url);
    assert.equal(url.origin, authOrigin, 'auth requests must go to the configured project');
    if (url.pathname === '/auth/v1/token') {
      const body = await request.json();
      if (body.email !== user.email || body.password !== 'test-password') {
        return Response.json({ code: 'invalid_credentials', msg: 'Invalid login credentials' }, { status: 400 });
      }
      return Response.json({ access_token: token, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, user });
    }
    if (url.pathname === '/auth/v1/user') {
      if (!revoked && request.headers.get('authorization') === `Bearer ${token}`) return Response.json(user);
      return Response.json({ code: 'bad_jwt', msg: 'Invalid JWT' }, { status: 401 });
    }
    if (url.pathname === '/auth/v1/logout') {
      revoked = true;
      return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected auth endpoint: ${url.pathname}`);
  };

  const request = (path, { cookie, fields } = {}) => server.respond(new Request(`${origin}${path}`, {
    method: fields ? 'POST' : 'GET',
    headers: { origin, accept: 'text/html', ...(cookie ? { cookie } : {}) },
    ...(fields ? { body: new URLSearchParams(fields) } : {})
  }), { getClientAddress: () => '127.0.0.1' });

  try {
    await server.init({ env: {} });
    let response = await request('/login', { fields: { email: user.email, password: 'test-password' } });
    assert.equal(response.status, 503, 'missing configuration fails safely');

    await server.init({ env: { PUBLIC_SUPABASE_URL: authOrigin, PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' } });
    response = await request('/account');
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/login');

    response = await request('/login', { fields: { email: user.email, password: 'wrong-password' } });
    assert.equal(response.status, 400);
    const failureHtml = await response.text();
    assert.match(failureHtml, /Unable to sign in/);
    assert.doesNotMatch(failureHtml, /wrong-password/);

    response = await request('/login', { fields: { email: user.email, password: 'test-password' } });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/account');
    const setCookies = response.headers.getSetCookie();
    assert.ok(setCookies.length > 0, 'login creates session cookies');
    assert.ok(setCookies.every((value) => /HttpOnly/i.test(value) && /Secure/i.test(value) && /SameSite=Lax/i.test(value)));
    const cookie = setCookies.map((value) => value.split(';')[0]).join('; ');

    response = await request('/account', { cookie });
    assert.equal(response.status, 200);
    assert.match(await response.text(), /instructor@example.test/);
    assert.match(response.headers.get('cache-control'), /no-store/);

    response = await request('/login', { cookie });
    assert.equal(response.headers.get('location'), '/account');

    response = await request('/classes', { cookie });
    assert.equal(response.status, 303, 'login alone cannot unlock instructor data');

    const forgedCookie = `sb-project-auth-token=base64-${encode({ access_token: 'forged.jwt.token', refresh_token: 'fake', expires_at: Math.floor(Date.now() / 1000) + 3600, user })}`;
    response = await request('/account', { cookie: forgedCookie });
    assert.equal(response.status, 303, 'forged session cookies do not grant access');

    response = await request('/account?/signout', { cookie, fields: {} });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/login');
    assert.ok(response.headers.getSetCookie().some((value) => /Max-Age=0/i.test(value)), 'sign-out clears the cookie');
    response = await request('/account', { cookie });
    assert.equal(response.status, 303, 'revoked session cannot access account');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
