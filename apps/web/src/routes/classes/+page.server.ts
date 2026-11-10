import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  // Keep the instructor workspace unavailable until server-verified roles exist.
  redirect(303, '/login');
};
