import { createRequire } from 'node:module';
import { restoreHostGtkEnvironment } from './snap-env.mjs';

restoreHostGtkEnvironment(process.env);

// Run the official CLI in this process, preserving arguments and signal handling.
const require = createRequire(import.meta.url);
require('@tauri-apps/cli/tauri.js');
