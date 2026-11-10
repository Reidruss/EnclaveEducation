import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) redirect(303, '/account');
  return { configured: Boolean(locals.supabase) };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.supabase) {
      return fail(503, {
        message: 'Sign-in is not configured yet. Please contact your institution.',
      });
    }

    const form = await request.formData();
    const email = form.get('email');
    const password = form.get('password');
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return fail(400, { message: 'Enter your email address and password.' });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      const temporary = !error.status || error.status >= 500 || error.status === 429;
      return fail(temporary ? 503 : 400, {
        message: temporary
          ? 'Sign-in is temporarily unavailable. Please try again shortly.'
          : 'Unable to sign in. Check your email and password, and make sure your email is confirmed.',
      });
    }

    redirect(303, '/account');
  },
};
