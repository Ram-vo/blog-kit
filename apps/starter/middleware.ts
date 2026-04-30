import { NextResponse, type NextRequest } from "next/server";
import {
  getStarterEditorAuthMode
} from "./src/editorial/auth";
import {
  readStarterEditorRequestToken,
  resolveStarterEditorAuthAction
} from "./src/editorial/auth-middleware";

export function middleware(request: NextRequest) {
  const action = resolveStarterEditorAuthAction(getStarterEditorAuthMode(), {
    pathname: request.nextUrl.pathname,
    cookieToken: readStarterEditorRequestToken(request)
  });

  if (action.type === "allow") {
    return NextResponse.next();
  }

  if (action.type === "deny-api") {
    return NextResponse.json({ message: "Editor access denied." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/editor/login";
  loginUrl.searchParams.set("next", action.nextPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/editor/:path*", "/api/editor/:path*"]
};
