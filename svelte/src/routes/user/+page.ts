import { redirect } from '@sveltejs/kit';

export function load() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (!token) throw redirect(302, '/auth');
  }

  throw redirect(302, '/user/dashboard');
}
