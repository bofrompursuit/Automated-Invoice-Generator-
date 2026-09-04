const TOKEN_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const GRAPH_SEND_MAIL_ENDPOINT = "https://graph.microsoft.com/v1.0/me/sendMail";
// offline_access is required to receive a refresh_token; Mail.Send is the delegated
// permission that lets us send as the signed-in personal Microsoft account.
const SCOPES = "openid profile offline_access Mail.Send";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured on the server.`);
  return value;
}

export function getMicrosoftAuthorizeUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("MICROSOFT_CLIENT_ID"),
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: SCOPES,
    state,
  });
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requireEnv("MICROSOFT_CLIENT_ID"),
      client_secret: requireEnv("MICROSOFT_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      scope: SCOPES,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to exchange authorization code: ${await res.text()}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

async function getAccessTokenFromRefreshToken(): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requireEnv("MICROSOFT_CLIENT_ID"),
      client_secret: requireEnv("MICROSOFT_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: requireEnv("MICROSOFT_REFRESH_TOKEN"),
      scope: SCOPES,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to refresh Microsoft access token: ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function sendMailViaGraph(options: {
  to: string;
  subject: string;
  text: string;
  attachment: { filename: string; contentBase64: string };
}) {
  const accessToken = await getAccessTokenFromRefreshToken();

  const res = await fetch(GRAPH_SEND_MAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject: options.subject,
        body: { contentType: "Text", content: options.text },
        toRecipients: [{ emailAddress: { address: options.to } }],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: options.attachment.filename,
            contentType: "application/pdf",
            contentBytes: options.attachment.contentBase64,
          },
        ],
      },
      saveToSentItems: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Microsoft Graph sendMail failed: ${await res.text()}`);
  }
}
