import NextAuth from "next-auth";
import { authConfig } from "./auth";

export const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/appointments/:path*',
    '/auth/:path*',
    '/api/auth/:path*',
    '/api/appointments/:path*'
  ]
};
