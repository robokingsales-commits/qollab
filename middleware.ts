import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check role requirement for owner routes
  if (pathname.startsWith("/owner")) {
    const roleCookie = request.cookies.get("qollab_user_role")?.value;
    const isOwner = roleCookie === "owner" || roleCookie === "admin";

    if (!roleCookie) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isOwner) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Check role requirement for admin routes
  if (pathname.startsWith("/admin")) {
    const roleCookie = request.cookies.get("qollab_user_role")?.value;
    const isAdmin = roleCookie === "admin";

    if (!roleCookie) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*"],
};
