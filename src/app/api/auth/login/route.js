import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";

const FAIL_DELAY_MS = 600;

function fail(status = 401, error = "Invalid username or password") {
  return new Promise((resolve) =>
    setTimeout(() => resolve(NextResponse.json({ error }, { status })), FAIL_DELAY_MS)
  );
}

export async function POST(request) {
  const expectedUser = process.env.AUTH_USERNAME;
  const hash = process.env.AUTH_PASSWORD_HASH;
  if (!expectedUser || !hash || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "Login is not configured. Set AUTH_USERNAME, AUTH_PASSWORD_HASH and AUTH_SECRET in .env.local." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return fail(400);
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const userOk = username === expectedUser;
  // Always run the hash comparison so timing does not reveal the username.
  const passOk = await bcrypt.compare(password, hash);
  if (!userOk || !passOk) return fail();

  const token = await signSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
