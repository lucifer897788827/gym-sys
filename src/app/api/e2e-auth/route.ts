import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (process.env.PLAYWRIGHT_E2E_AUTH !== "1") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const expectedSecret = process.env.PLAYWRIGHT_E2E_AUTH_SECRET;
  const providedSecret = url.searchParams.get("secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const personaParam = url.searchParams.get("persona");
  const persona =
    personaParam === "member" || personaParam === "unprovisioned"
      ? personaParam
      : "internal";
  const redirectTo = url.searchParams.get("next") ?? "/";
  const response = NextResponse.redirect(new URL(redirectTo, url.origin));

  response.cookies.set("playwright_e2e_auth", persona, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("playwright_e2e_auth_secret", expectedSecret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
