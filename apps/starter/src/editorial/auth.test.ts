import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStarterEditorAuthMode,
  isValidStarterEditorToken,
  readBearerToken,
  STARTER_EDITOR_TOKEN_COOKIE
} from "./auth";
import { resolveStarterEditorAuthAction } from "./auth-middleware";
import {
  DELETE as deleteSession,
  POST as createSession
} from "../../app/api/editor/session/route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("starter editor auth", () => {
  it("defaults to open mode unless token mode is configured", () => {
    expect(getStarterEditorAuthMode()).toBe("open");

    vi.stubEnv("STARTER_EDITOR_AUTH_MODE", "token");

    expect(getStarterEditorAuthMode()).toBe("token");
  });

  it("reads bearer tokens and validates them against env config", () => {
    vi.stubEnv("STARTER_EDITOR_ACCESS_TOKEN", "secret-token");

    expect(readBearerToken("Bearer secret-token")).toBe("secret-token");
    expect(readBearerToken("Basic secret-token")).toBeNull();
    expect(isValidStarterEditorToken("secret-token")).toBe(true);
    expect(isValidStarterEditorToken("wrong-token")).toBe(false);
  });

  it("allows open mode and login routes without a token", () => {
    expect(
      resolveStarterEditorAuthAction("open", {
        pathname: "/editor"
      })
    ).toEqual({ type: "allow" });

    expect(
      resolveStarterEditorAuthAction("token", {
        pathname: "/editor/login"
      })
    ).toEqual({ type: "allow" });
  });

  it("denies editor APIs and redirects pages in token mode", () => {
    vi.stubEnv("STARTER_EDITOR_ACCESS_TOKEN", "secret-token");

    expect(
      resolveStarterEditorAuthAction("token", {
        pathname: "/api/editor/posts"
      })
    ).toEqual({ type: "deny-api" });

    expect(
      resolveStarterEditorAuthAction("token", {
        pathname: "/editor"
      })
    ).toEqual({
      type: "redirect-login",
      nextPath: "/editor"
    });
  });

  it("allows bearer and cookie tokens in token mode", () => {
    vi.stubEnv("STARTER_EDITOR_ACCESS_TOKEN", "secret-token");

    expect(
      resolveStarterEditorAuthAction("token", {
        pathname: "/api/editor/posts",
        authorizationHeader: "Bearer secret-token"
      })
    ).toEqual({ type: "allow" });

    expect(
      resolveStarterEditorAuthAction("token", {
        pathname: "/editor",
        cookieToken: "secret-token"
      })
    ).toEqual({ type: "allow" });
  });

  it("creates and clears the editor session cookie", async () => {
    vi.stubEnv("STARTER_EDITOR_ACCESS_TOKEN", "secret-token");

    const created = await createSession(
      new Request("http://localhost/api/editor/session", {
        method: "POST",
        body: JSON.stringify({ token: "secret-token" })
      })
    );
    const cleared = await deleteSession();

    expect(created.status).toBe(200);
    expect(created.headers.get("set-cookie")).toContain(STARTER_EDITOR_TOKEN_COOKIE);
    expect(created.headers.get("set-cookie")).toContain("HttpOnly");
    expect(cleared.headers.get("set-cookie")).toContain(STARTER_EDITOR_TOKEN_COOKIE);
    expect(cleared.headers.get("set-cookie")).toContain("Expires=Thu, 01 Jan 1970");
  });

  it("rejects invalid editor session tokens", async () => {
    vi.stubEnv("STARTER_EDITOR_ACCESS_TOKEN", "secret-token");

    const response = await createSession(
      new Request("http://localhost/api/editor/session", {
        method: "POST",
        body: JSON.stringify({ token: "wrong-token" })
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid editor access token."
    });
  });
});
