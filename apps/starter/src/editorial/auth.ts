export type StarterEditorAuthMode = "open" | "token";

export const STARTER_EDITOR_TOKEN_COOKIE = "starter_editor_token";

function getEnv(name: string) {
  const value = process.env[name];
  return value && value.length > 0 ? value : null;
}

export function getStarterEditorAuthMode(): StarterEditorAuthMode {
  return getEnv("STARTER_EDITOR_AUTH_MODE") === "token" ? "token" : "open";
}

export function isStarterEditorAuthEnabled() {
  return getStarterEditorAuthMode() !== "open";
}

export function getStarterEditorAccessToken() {
  return getEnv("STARTER_EDITOR_ACCESS_TOKEN");
}

export function readBearerToken(headerValue: string | null) {
  if (!headerValue?.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice("Bearer ".length).trim() || null;
}

export function isValidStarterEditorToken(token: string | null | undefined) {
  const expectedToken = getStarterEditorAccessToken();

  if (!expectedToken) {
    return false;
  }

  return token === expectedToken;
}
