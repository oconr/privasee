import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session_jwt");
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (session) {
    return NextResponse.rewrite(new URL(`/auth${pathname}`, request.url));
  }

  return NextResponse.rewrite(new URL(`/noAuth${pathname}`, request.url));
}
