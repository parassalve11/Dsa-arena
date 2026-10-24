import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const user = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (PUBLIC_PATHS.includes(pathname)) {
    // Already signed in: skip the login screen.
    if (user && pathname === "/login") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except Next internals and static files in /public.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|workers/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|js|css|woff2?)$).*)",
  ],
};
