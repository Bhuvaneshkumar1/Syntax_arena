/**
 * Vercel Serverless Function: Google OAuth 2.0 / OpenID Connect Handler
 * Supports both OAuth 2.0 redirect flow and Google One-Tap / GIS token verification.
 */

export default async function handler(req, res) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const APP_URL = process.env.APP_URL || (req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : 'https://syntaxarena-phi.vercel.app');
  const CALLBACK_URL = `${APP_URL}/api/auth/google`;

  // Handle GIS / One-Tap Token Verification via POST
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const credential = body.credential;
      if (!credential) {
        return res.status(400).json({ error: 'Missing credential token' });
      }

      // Verify token with Google public endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      const payload = await verifyRes.json();

      if (payload.error_description || !payload.email) {
        return res.status(401).json({ error: payload.error_description || 'Invalid Google ID token' });
      }

      return res.status(200).json({
        provider: 'google',
        providerUserId: payload.sub,
        email: payload.email,
        displayName: payload.name || payload.email.split('@')[0],
        avatarUrl: payload.picture,
        verifiedEmail: payload.email_verified
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 1. Check if Google credentials are configured
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SyntaxArena — Google OAuth Setup Required</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: sans-serif; background: #0e131d; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem;">
        <div style="background: #151b29; border: 1px solid #2d3a54; border-radius: 12px; padding: 2rem; max-width: 520px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          <h2 style="color: #f43f5e; margin-top: 0;">⚠️ Google OAuth Setup Required</h2>
          <p style="color: #94a3b8; line-height: 1.5;">To enable real Google sign-in, add these environment variables in your Vercel project dashboard:</p>
          <ul style="background: #0b0f17; padding: 1rem 1.5rem; border-radius: 8px; font-family: monospace; font-size: 13px; color: #38bdf8;">
            <li>GOOGLE_CLIENT_ID</li>
            <li>GOOGLE_CLIENT_SECRET</li>
          </ul>
          <p style="color: #94a3b8; font-size: 13px;">Authorized Redirect URI: <code style="color: #34d399;">${CALLBACK_URL}</code></p>
          <button onclick="window.close()" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Close Window</button>
        </div>
      </body>
      </html>
    `);
  }

  const { action, code } = req.query;

  // 2. Step 1: Initiate OAuth Authorization Request
  if (action === 'login' || !code) {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&response_type=code&scope=openid%20email%20profile&access_type=online&prompt=select_account`;
    return res.redirect(302, googleAuthUrl);
  }

  // 3. Step 2: Handle Callback and Exchange Code for Token
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: CALLBACK_URL
      }).toString()
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange authorization code.');
    }

    // Fetch user profile from Google UserInfo API
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    const userData = await userResponse.json();

    const derivedUsername = (userData.email ? userData.email.split('@')[0] : (userData.name || 'coder')).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 16);
    const payload = {
      provider: 'google',
      providerUserId: String(userData.sub),
      email: userData.email,
      displayName: userData.name || derivedUsername,
      username: derivedUsername,
      avatarUrl: userData.picture,
      token: tokenData.access_token
    };

    // Return HTML bridge to communicate payload to client window
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SyntaxArena — Google Authenticated</title></head>
      <body style="background: #0e131d; color: #34d399; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center;">
          <h3 style="color: #38bdf8;">✓ Google Authentication Verified</h3>
          <p style="color: #94a3b8;">Connecting to SyntaxArena session...</p>
        </div>
        <script>
          const authPayload = ${JSON.stringify(payload)};
          if (window.opener) {
            window.opener.postMessage({ type: 'SYNTAXARENA_AUTH_SUCCESS', payload: authPayload }, '*');
            setTimeout(() => window.close(), 600);
          } else {
            localStorage.setItem('syntaxarena_oauth_pending', JSON.stringify(authPayload));
            window.location.href = '/index.html?auth=success';
          }
        </script>
      </body>
      </html>
    `);

  } catch (err) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SyntaxArena — Auth Error</title></head>
      <body style="background: #0e131d; color: #f43f5e; font-family: sans-serif; padding: 2rem;">
        <h3>❌ Google Authentication Failed</h3>
        <p style="color: #94a3b8;">${err.message}</p>
        <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Close</button>
      </body>
      </html>
    `);
  }
}

