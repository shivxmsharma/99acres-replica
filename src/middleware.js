export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/post-property/:path*",
    "/property/:path*", // Protect property details as well? User said "anything else should require register and login"
    "/search/:path*",
    // Exclude /, /login, /register, and /api routes (auth is handled automatically by matcher exclusion)
  ],
};
