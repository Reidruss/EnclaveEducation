# Architecture and next milestones

The SvelteKit web application owns professor and student onboarding, class management, assignment authoring, and desktop downloads. ASP.NET owns identity integration, authorization, durable data, exam sessions, and submissions. The Tauri client owns the student exam interface and future platform integrations. Both UIs call the API using the shared TypeScript client.

The current API deliberately exposes its in-memory demo routes only in Development. It has no authentication. Production currently serves only the health endpoint. CORS is browser policy, not authorization.

## Planned domain

- User: external identity subject, institution membership, authorized roles.
- Course and Enrollment: professor ownership and student membership.
- Assignment: course, prompt, language, duration, schedule, allowed resources, grading configuration.
- ExamSession: assignment, student, server-owned start and expiry, status.
- Submission: session, immutable source snapshot, server receipt time, grading result.

## Milestones

1. Configure an identity provider, verified professor access, student roles, and authorization policies. Use an appropriate web session design and authorization code + PKCE for desktop. Never trust a self-selected professor role.
2. Add EF Core, PostgreSQL, migrations, course ownership, enrollment, and authorization tests. Replace the in-memory demo routes with protected persistence-backed routes.
3. Add assignment prompts, scheduling, exam eligibility, and server-owned time limits. Treat desktop state as untrusted input.
4. Add durable local drafts, reconnect behavior, authenticated exam sessions, idempotent submissions, and receipt confirmation. Keep the scratch editor separate from real exam session data until these exist.
5. Implement isolated code execution workers with strict time, memory, filesystem, and network limits. Never execute student code in the API process.
6. Define the lockdown threat model and supported OS/device-management combinations. Fullscreen and focus events do not establish lockdown. Design platform-specific controls, accessibility accommodations, recovery paths, and auditable policy events.
7. Add signed/notarized installers, update verification, release hosting, real download links, and CI across Windows, macOS, and Linux.

## Testing direction

Add integration tests for access boundaries, course ownership, enrollment, exam eligibility, expiry, and duplicate submissions as those features arrive. Add end-to-end coverage for professor authoring and student exam recovery. Native controls require testing on supported real platforms.
