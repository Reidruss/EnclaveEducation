# Enclave Education

A monorepo skeleton for web-managed computer science classes and coding exams delivered through a cross-platform desktop client.

## Layout

- `apps/web` — SvelteKit + TypeScript: landing page, Supabase email/password login, account page, gated class and assignment demo, downloads placeholder.
- `apps/desktop` — Tauri 2 + Svelte + Vite: student code entry and remembered development enrollment.
- `services/EnclaveEducation.Api` — ASP.NET Core 10 minimal API with development-only, in-memory class and assignment endpoints.
- `packages/contracts` — shared TypeScript DTOs and API client. Keep these in sync with the C# records; generated OpenAPI contracts are a future improvement.
- `docs/architecture.md` — boundaries and implementation roadmap.

## Prerequisites

Node.js 22.12+ and npm, .NET SDK 10, and Rust stable for native desktop builds. Install the [Tauri system prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS. Linux requires GTK 3 and WebKitGTK 4.1 development packages. Windows uses WebView2 and C++ build tools; macOS requires Xcode command line tools.

## Run

```sh
npm install
npm run dev
```

Web: http://localhost:5173. API: http://localhost:5080/health. The API launch profile sets `Development`; its demo endpoints are unavailable in other environments.

In another terminal, launch the native client:

```sh
npm run dev:desktop
```

On Linux, the desktop launcher restores host GTK settings saved by VS Code's Snap package. This avoids a startup crash about the missing `org.gnome.settings-daemon.plugins.xsettings` `antialiasing` key when launching from its integrated terminal.

Or preview only its UI in a browser (no native prerequisites):

```sh
npm run dev -w @enclave/desktop
```

Enter **ENCLAVE-DEMO** in the desktop app to join the development **CS 201** class. Invalid codes show an error. The client saves an opaque session token on this device and checks it with the API each time the app opens, skipping code entry while enrollment remains valid. Connection failures offer a retry and keep the saved token. **Use a different student code** clears the local session.

This fixture is available only with the API in Development. Its enrollment lasts 90 days from API startup, and sessions are held in memory: restarting the API requires entering the code again. Production needs personalized code issuance, durable enrollment/session storage, revocation, and appropriate credential storage before this can serve real students. Assignments and exam delivery are not connected yet.

The Svelte flow is split into `apps/desktop/src/Login.svelte` (form state and submission), `App.svelte` (startup checks and conditional screens), and `enrollment.ts` (saving/restoring sessions). `$state` makes form and enrollment values reactive; `bind:value` connects the input to its variable; the form calls the parent through an `onsubmit` prop; `{#if}` selects the screen. The server decides whether the saved enrollment is still valid.

Optional: copy each app's `.env.example` to `.env` to customize its API URL. If changing the desktop API origin, also update the Tauri CSP in `tauri.conf.json`; configure allowed browser origins in the API settings. Never put secrets in public frontend environment variables.

To connect web sign-in, set your Supabase project URL and publishable key in `apps/web/.env`. See [authentication setup](docs/authentication.md) for dashboard setup, test accounts, and the remaining instructor/API authorization work. The classes page stays blocked until that authorization is implemented.

## Verify and build

Both Svelte apps use [Tailwind CSS with the Vite plugin](https://tailwindcss.com/docs/installation/using-vite). Style components with utility classes in the `.svelte` markup. Shared colors and fonts are defined with `@theme` in `apps/web/src/app.css` and `apps/desktop/src/app.css`; these generate utilities such as `bg-canvas` and `text-muted`. Each app scans its own `src` directory. The stylesheets import Tailwind's theme and utilities without Preflight to retain the existing browser defaults for headings, paragraphs, lists, and forms.

Run `npm run format` to format the frontend, shared TypeScript, configuration files, and C# API. Run `npm run format:check` to check formatting without rewriting files. These commands require the .NET SDK; generated files and build output are excluded. Rust source follows standard rustfmt formatting (`cargo fmt --manifest-path apps/desktop/src-tauri/Cargo.toml` when rustfmt is installed).

```sh
npm run check
npm run test:auth -w @enclave/web
npm run test:enrollment -w @enclave/desktop
npm run build
npm run build:desktop
```

`build` compiles the web app, desktop frontend, and API. `build:desktop` separately compiles Rust and creates platform-specific native installers, requiring native toolchains. Build installers on each target OS. The web app uses adapter-auto; choose a deployment adapter when hosting is selected. Commit the npm and Cargo lockfiles for reproducible installs.

## Scope

Implemented: responsive starter screens, Supabase web email/password sign-in and sign-out, a protected account page, shared API types, development-only class/assignment CRUD subset (list, get, create), input validation, API CORS configuration, and Tauri application wiring.

Not implemented: registration, account recovery, instructor roles, production API authorization, application data persistence, production enrollment, exam scheduling or sessions, code execution, grading, submission storage, signed downloads, auto-updates, or lockdown controls. All API demo data resets on restart. See the architecture document before adding production endpoints.

The application is not ready to administer real exams. Tauri alone does not enforce OS lockdown; restrictions require platform-specific design, testing, and an explicit threat model.

Framework references: [Svelte CLI](https://svelte.dev/docs/cli/overview), [ASP.NET minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-10.0), [Tauri project setup](https://v2.tauri.app/start/create-project/).
