# Enclave Education

A monorepo skeleton for web-managed computer science classes and coding exams delivered through a cross-platform desktop client.

## Layout

- `apps/web` — SvelteKit + TypeScript: landing page, Supabase email/password login, account page, gated class and assignment demo, downloads placeholder.
- `apps/desktop` — Tauri 2 + Svelte + Vite: assignment draft viewer and scratch code editor.
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

Or preview only its UI in a browser (no native prerequisites):

```sh
npm run dev -w @enclave/desktop
```

Click **Connect to demo API** in the desktop app to view demo data. The desktop editor is an unsaved scratch area; selecting a draft does not create an exam session.

Optional: copy each app's `.env.example` to `.env` to customize its API URL. If changing the desktop API origin, also update the Tauri CSP in `tauri.conf.json`; configure allowed browser origins in the API settings. Never put secrets in public frontend environment variables.

To connect web sign-in, set your Supabase project URL and publishable key in `apps/web/.env`. See [authentication setup](docs/authentication.md) for dashboard setup, test accounts, and the remaining instructor/API authorization work. The classes page stays blocked until that authorization is implemented.

## Verify and build

```sh
npm run check
npm run test:auth -w @enclave/web
npm run build
npm run build:desktop
```

`build` compiles the web app, desktop frontend, and API. `build:desktop` separately compiles Rust and creates platform-specific native installers, requiring native toolchains. Build installers on each target OS. The web app uses adapter-auto; choose a deployment adapter when hosting is selected. Commit the npm and Cargo lockfiles for reproducible installs.

## Scope

Implemented: responsive starter screens, Supabase web email/password sign-in and sign-out, a protected account page, shared API types, development-only class/assignment CRUD subset (list, get, create), input validation, API CORS configuration, and Tauri application wiring.

Not implemented: registration, account recovery, instructor roles, API authorization, application data persistence, enrollment, exam scheduling or sessions, code execution, grading, submission storage, signed downloads, auto-updates, or lockdown controls. All API demo data resets on restart. See the architecture document before adding production endpoints.

The application is not ready to administer real exams. Tauri alone does not enforce OS lockdown; restrictions require platform-specific design, testing, and an explicit threat model.

Framework references: [Svelte CLI](https://svelte.dev/docs/cli/overview), [ASP.NET minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-10.0), [Tauri project setup](https://v2.tauri.app/start/create-project/).
