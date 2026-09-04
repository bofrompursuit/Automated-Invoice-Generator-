import { NextResponse } from "next/server";
import { getMicrosoftAuthorizeUrl } from "@/lib/microsoft-graph";

export async function GET() {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/microsoft/callback`;
  const state = crypto.randomUUID();

  const response = NextResponse.redirect(getMicrosoftAuthorizeUrl(redirectUri, state));
  response.cookies.set("ms_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
