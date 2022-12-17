
import { redirect } from '@sveltejs/kit';

export const authGuard = async function ({ url, session }) {
  if(/^\/admin/.test(url.pathname) && !session.user.IsAdministrator) {
    console.log('%cForbidden: Only administrators may access /admin routes.', 'font: bold 24px; color: red;')
    throw redirect(302, '/');
  }
  return { props: {} }
}
