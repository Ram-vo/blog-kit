import { NextResponse } from "next/server";
import {
  isValidStarterEditorToken,
  STARTER_EDITOR_TOKEN_COOKIE
} from "../../../../src/editorial/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as { token?: string };
  const token = payload.token;

  if (!token || !isValidStarterEditorToken(token)) {
    return NextResponse.json(
      { message: "Invalid editor access token." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(STARTER_EDITOR_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(STARTER_EDITOR_TOKEN_COOKIE);

  return response;
}
