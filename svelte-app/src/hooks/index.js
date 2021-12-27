import * as cookie from 'cookie'
import * as jwt from 'jwt-simple'

export async function handle({request, resolve}) {
  const cookies = cookie.parse(request.headers.cookie || '')

  if(cookies.refresh) {
    request.locals.token = cookies.refresh;
    request.locals.user = jwt.decode(cookies.refresh,process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET);
  }
  const response = await resolve(request)

  return {
    ...response,
    headers: {
      ...response.headers,
    }
  }

}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
    return {
        token: request.locals.token,
        user: request.locals.user
    }
}