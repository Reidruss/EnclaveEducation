// VS Code's Snap launcher saves the host values before replacing GTK settings.
// Native apps must use those host values with the system GTK/WebKit libraries.
export function restoreHostGtkEnvironment(env, platform = process.platform) {
  if (platform !== 'linux') return;

  for (const name of [
    'GDK_BACKEND',
    'GSETTINGS_SCHEMA_DIR',
    'GTK_PATH',
    'GTK_EXE_PREFIX',
    'GTK_IM_MODULE_FILE',
    'GIO_MODULE_DIR',
    'XDG_DATA_DIRS',
    'XDG_CONFIG_DIRS',
  ]) {
    const original = env[`${name}_VSCODE_SNAP_ORIG`];
    if (original === undefined) continue;
    if (original) env[name] = original;
    else delete env[name];
  }
}
