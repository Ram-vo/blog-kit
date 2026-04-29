import { NextResponse, type NextRequest } from "next/server";
import {
  getStarterEditorAuthMode,
  isValidStarterEditorToken,
  readBearerToken,
  STARTER_EDITOR_TOKEN_COOKIE
} from "./src/editorial/auth";

function isEditorLoginPath(pathname: string) {
  return pathname === "/editor/login" || pathname === "/api/editor/session";
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}

function readRequestToken(request: NextRequest) {
  return (
    readBearerToken(request.headers.get("authorization")) ??
    request.cookies.get(STARTER_EDITOR_TOKEN_COOKIE)?.value ??
    null
  );
}

export function middleware(request: NextRequest) {
  if (getStarterEditorAuthMode() === "open" || isEditorLoginPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (isValidStarterEditorToken(readRequestToken(request))) {
    return NextResponse.next();
  }

  if (isApiPath(request.nextUrl.pathname)) {
    return NextResponse.json({ message: "Editor access denied." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/editor/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/editor/:path*", "/api/editor/:path*"]
};
