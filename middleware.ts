import { auth } from "@/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  generateRouteAffix,
} from "./routes";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  const isApiRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isGenerateRoutes = nextUrl.pathname.endsWith(generateRouteAffix);

  // route for check if user exist in DB && for files
  if (
    nextUrl.pathname === "/api/users/check" ||
    nextUrl.pathname === "/api/files"
  ) {
    return;
  }

  if (isGenerateRoutes) {
    return;
  }

  if (isApiRoutes) {
    return;
  }

  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/masuk", nextUrl));
  }

  // check if user exist in DB every api request
  if (nextUrl.pathname !== "/logout") {
    const checkUserResponse = await fetch(
      `${nextUrl.origin}/api/users/check?id=${req.auth?.user.id}`
    );

    if (checkUserResponse.status === 404) {
      return Response.redirect(new URL("/logout", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
