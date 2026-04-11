import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/api/google/callback";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return new NextResponse(`<h1>Error: ${error}</h1>`, { headers: { "Content-Type": "text/html" } });
  }

  if (!code) {
    return new NextResponse("<h1>Missing code</h1>", { headers: { "Content-Type": "text/html" } });
  }

  const body = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await res.json();

  if (data.error) {
    return new NextResponse(`<h1>Token Error</h1><pre>${JSON.stringify(data, null, 2)}</pre>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  let gmailTest = "N/A";
  if (data.access_token) {
    const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const profile = await gmailRes.json();
    gmailTest = JSON.stringify(profile, null, 2);
  }

  return new NextResponse(
    `<html><body style="font-family:monospace;padding:2rem;background:#111;color:#eee">
      <h1>Google OAuth2 Success</h1>
      <h3>Gmail Profile:</h3>
      <pre>${gmailTest}</pre>
      <h3>Refresh Token (copy this):</h3>
      <textarea rows="5" cols="80" style="background:#222;color:#0f0;padding:8px">${data.refresh_token || "NO REFRESH TOKEN"}</textarea>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
