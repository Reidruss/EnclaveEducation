import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  event.locals.supabase = null;
  event.locals.user = null;

  if (url && key) {
    event.locals.supabase = createServerClient(url, key, {
      // Auth is server-only; browser JavaScript does not need session tokens.
      cookieOptions: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: event.url.protocol === 'https:'
      },
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            event.cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    });

    // getUser verifies the session with Supabase; never trust cookie contents alone.
    const { data, error } = await event.locals.supabase.auth.getUser();
    event.locals.user = error ? null : data.user;
  }

  const response = await resolve(event);
  // Refreshed session cookies and personalized HTML must not enter shared caches.
  response.headers.set('cache-control', 'private, no-store');
  return response;
};
