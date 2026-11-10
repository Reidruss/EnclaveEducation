import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) redirect(303, '/login');
  return { email: locals.user.email };
};

export const actions: Actions = {
  signout: async ({ locals }) => {
    if (!locals.supabase) redirect(303, '/login');
    const { error } = await locals.supabase.auth.signOut({ scope: 'local' });
    if (error) return fail(503, { message: 'Could not sign out. Please try again.' });
    redirect(303, '/login');
  },
};
