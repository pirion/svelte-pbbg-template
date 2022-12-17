// src/routes/+layout.server.js

import * as cookie from 'cookie'
import * as jwt from 'jwt-simple'

export async function parseUser(request) {
  const cookies = cookie.parse(request.headers.get("cookie") || '')

  if(cookies.refresh) {
    return {
        token: cookies.refresh,
        user: jwt.decode(cookies.refresh,process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET)
    }
  }
} 

import {authGuard} from '$lib/guards/authGuard';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request, url }) {
    let context = {
      authenticated: false
    };


    let session = await parseUser(request);
    
    if(session) {
      context.token = session.token;
      context.user = session.user.username;
      context.authenticated = true;
    }

    await authGuard({url: url, session});
    
    return {
        context
    };
}