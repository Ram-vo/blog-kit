import {
  isValidStarterEditorToken,
  readBearerToken,
  STARTER_EDITOR_TOKEN_COOKIE,
  type StarterEditorAuthMode
} from "./auth";

export type StarterEditorAuthAction =
  | { type: "allow" }
  | { type: "deny-api" }
  | { type: "redirect-login"; nextPath: string };

export interface StarterEditorAuthRequest {
  pathname: string;
  authorizationHeader?: string | null;
  cookieToken?: string | null;
}

export function isStarterEditorLoginPath(pathname: string) {
  return pathname === "/editor/login" || pathname === "/api/editor/session";
}

export function isStarterEditorApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}

export function readStarterEditorRequestToken(request: {
  headers: { get(name: string): string | null };
  cookies: { get(name: typeof STARTER_EDITOR_TOKEN_COOKIE): { value: string } | undefined };
}) {
  return (
    readBearerToken(request.headers.get("authorization")) ??
    request.cookies.get(STARTER_EDITOR_TOKEN_COOKIE)?.value ??
    null
  );
}

export function resolveStarterEditorAuthAction(
  mode: StarterEditorAuthMode,
  request: StarterEditorAuthRequest
): StarterEditorAuthAction {
  if (mode === "open" || isStarterEditorLoginPath(request.pathname)) {
    return { type: "allow" };
  }

  const token = readBearerToken(request.authorizationHeader ?? null) ?? request.cookieToken;

  if (isValidStarterEditorToken(token)) {
    return { type: "allow" };
  }

  if (isStarterEditorApiPath(request.pathname)) {
    return { type: "deny-api" };
  }

  return {
    type: "redirect-login",
    nextPath: request.pathname
  };
}
