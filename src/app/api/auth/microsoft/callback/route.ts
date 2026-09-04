import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForTokens } from "@/lib/microsoft-graph";

function htmlPage(bodyHtml: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8" /><title>Microsoft account</title></head>
     <body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px;">
       ${bodyHtml}
     </body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("ms_oauth_state")?.value;

  if (!code) {
    return htmlPage("<h1>Missing authorization code</h1><p>Start over at /api/auth/microsoft/login.</p>");
  }
  if (!state || !expectedState || state !== expectedState) {
    return htmlPage(
      "<h1>Invalid state</h1><p>Possible CSRF or expired session — start over at /api/auth/microsoft/login.</p>",
    );
  }

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/auth/microsoft/callback`;

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    return htmlPage(`
      <h1>Microsoft account connected</h1>
      <p>Copy this value into <code>MICROSOFT_REFRESH_TOKEN</code> in <code>.env.local</code>
      (and your Vercel production env), then restart the app. This page will not show it again.</p>
      <textarea readonly style="width:100%;height:120px;font-family:monospace;font-size:13px;">${tokens.refresh_token}</textarea>
    `);
  } catch (err) {
    return htmlPage(
      `<h1>Connection failed</h1><pre>${err instanceof Error ? err.message : "Unknown error"}</pre>`,
    );
  }
}
