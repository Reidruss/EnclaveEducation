# Supabase web authentication

## Connect your project

1. In your Supabase project's Connect dialog, copy the project URL and publishable API key. A legacy anon key also works in the publishable-key setting. Never use a secret or service-role key here.
2. Create `apps/web/.env` (ignored by Git), using `apps/web/.env.example` as a reference. Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` to your project's values; retain `PUBLIC_API_URL` for the existing demo API.
3. In Supabase Authentication, ensure the Email provider is enabled. For an initial test, create a user with an email and password from Authentication → Users → Add user. Confirm that test user's email (the dashboard may offer Auto Confirm User).
4. Run `npm run dev:web` and visit `http://127.0.0.1:5173/login`. Sign in with that test user. You should arrive at `/account`; reloading should preserve the session. Sign out and confirm `/account` redirects back to `/login`.
5. Try an incorrect password: the page should show a generic error without revealing whether an account exists. An unsigned request to `/classes` should still redirect to sign-in.

For deployment, configure the same environment variables on the web server and serve the app over HTTPS. Use a SvelteKit deployment adapter with server support; form actions and session verification require a running server. Configure Supabase's Site URL for your production origin before adding email links, invitations, or password recovery. This email/password flow does not need an OAuth callback route.

## Implementation

The SvelteKit server creates a request-scoped `@supabase/ssr` client. Login uses a POST form action and `signInWithPassword`; Supabase access and refresh tokens are stored in HTTP-only cookies. `getUser` verifies sessions with Supabase before protected pages render. Responses are marked private/no-store. Only sign-in state and the account email are returned to the UI, never session tokens or passwords. Sign-out is POST-only and ends the current session.

No database connection string, service-role key, custom user table, or SQL migration is needed for this login flow. Supabase Auth manages its own users.

Run `npm run test:auth -w @enclave/web` to build and exercise the routes with the real Supabase SDK against mocked auth responses. This covers missing configuration, invalid credentials, verified cookie sessions, forged-cookie rejection, protected pages, and sign-out. It does not contact a real Supabase project.

## Remaining work

This change connects web login only. Public registration, invitations, password recovery, desktop login, institution membership, instructor approval, and API authorization remain separate features. Users cannot grant themselves instructor access. The classes page stays blocked because the ASP.NET demo API still has no authorization; hiding navigation or adding a web session does not protect that API. Before enabling the workspace, validate Supabase access tokens in ASP.NET and enforce course ownership and approved instructor roles on every relevant endpoint.

References: [Supabase SvelteKit guide](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit), [password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
