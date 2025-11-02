import { redirect } from '@sveltejs/kit';

export function load() {
  // This runs both on server and client,
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) throw redirect(302, '/user');
  }
}
