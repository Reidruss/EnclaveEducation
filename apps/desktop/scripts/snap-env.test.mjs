import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreHostGtkEnvironment } from './snap-env.mjs';

test('restores host schema search paths and removes Snap-only GTK overrides', () => {
  const env = {
    XDG_DATA_DIRS: '/snap/code/271/usr/share:/usr/share',
    XDG_DATA_DIRS_VSCODE_SNAP_ORIG: '/usr/local/share:/usr/share',
    GSETTINGS_SCHEMA_DIR: '/snap/code/schemas',
    GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: '',
    GTK_PATH: '/snap/code/gtk',
    GTK_PATH_VSCODE_SNAP_ORIG: '',
    DISPLAY: ':0',
    WAYLAND_DISPLAY: 'wayland-0',
  };
  restoreHostGtkEnvironment(env, 'linux');
  assert.equal(env.XDG_DATA_DIRS, '/usr/local/share:/usr/share');
  assert.equal(env.GSETTINGS_SCHEMA_DIR, undefined);
  assert.equal(env.GTK_PATH, undefined);
  assert.equal(env.DISPLAY, ':0');
  assert.equal(env.WAYLAND_DISPLAY, 'wayland-0');
});

test('preserves explicit host settings and is safe to call again', () => {
  const env = { GDK_BACKEND: 'wayland', GDK_BACKEND_VSCODE_SNAP_ORIG: 'x11' };
  restoreHostGtkEnvironment(env, 'linux');
  restoreHostGtkEnvironment(env, 'linux');
  assert.equal(env.GDK_BACKEND, 'x11');
});

test('leaves environments without Snap saved values unchanged', () => {
  const env = { GTK_PATH: '/custom/gtk', XDG_DATA_DIRS: '/custom/share' };
  restoreHostGtkEnvironment(env, 'linux');
  assert.deepEqual(env, { GTK_PATH: '/custom/gtk', XDG_DATA_DIRS: '/custom/share' });
});

test('leaves other platforms unchanged', () => {
  for (const platform of ['win32', 'darwin']) {
    const env = { GTK_PATH: 'current', GTK_PATH_VSCODE_SNAP_ORIG: 'original' };
    restoreHostGtkEnvironment(env, platform);
    assert.equal(env.GTK_PATH, 'current');
  }
});
