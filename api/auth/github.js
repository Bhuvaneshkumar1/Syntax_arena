/**
 * Vercel Serverless Function: GitHub OAuth 2.0 Handler
 * Handles OAuth redirection, code exchange, and profile ingestion.
 */

export default async function handler(req, res) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const APP_URL = process.env.APP_URL || (req.headers['x-forwarded-host'] ? `https://${req.headers['x-forwarded-host']}` : 'https://syntaxarena-phi.vercel.app');
  const CALLBACK_URL = `${APP_URL}/api/auth/github`;

  // 1. Check if GitHub credentials are configured
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SyntaxArena — GitHub OAuth Setup Required</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: sans-serif; background: #0e131d; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem;">
        <div style="background: #151b29; border: 1px solid #2d3a54; border-radius: 12px; padding: 2rem; max-width: 520px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          <h2 style="color: #f43f5e; margin-top: 0;">⚠️ GitHub OAuth Setup Required</h2>
          <p style="color: #94a3b8; line-height: 1.5;">To enable real GitHub sign-in, add these environment variables in your Vercel project dashboard:</p>
          <ul style="background: #0b0f17; padding: 1rem 1.5rem; border-radius: 8px; font-family: monospace; font-size: 13px; color: #38bdf8;">
            <li>GITHUB_CLIENT_ID</li>
            <li>GITHUB_CLIENT_SECRET</li>
          </ul>
          <p style="color: #94a3b8; font-size: 13px;">Authorization Callback URL: <code style="color: #34d399;">${CALLBACK_URL}</code></p>
          <button onclick="window.close()" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 1rem;">Close Window</button>
        </div>
      </body>
      </html>
    `);
  }

  const { action, code } = req.query;

  // 2. Step 1: Initiate OAuth Authorization Request
  if (action === 'login' || !code) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user%20user:email&redirect_uri=${encodeURIComponent(CALLBACK_URL)}`;
    return res.redirect(302, githubAuthUrl);
  }

  // 3. Step 2: Handle Callback and Exchange Code for Token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: CALLBACK_URL
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange authorization code.');
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile from GitHub API
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'SyntaxArena-Auth-Engine'
      }
    });
    const userData = await userResponse.json();

    // Fetch primary verified email if not public
    let userEmail = userData.email;
    if (!userEmail) {
      try {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'SyntaxArena-Auth-Engine'
          }
        });
        const emails = await emailsResponse.json();
        if (Array.isArray(emails)) {
          const primaryEmailObj = emails.find(e => e.primary && e.verified) || emails[0];
          if (primaryEmailObj) userEmail = primaryEmailObj.email;
        }
      } catch (e) {
        // Fallback email
      }
    }

    const payload = {
      provider: 'github',
      providerUserId: String(userData.id),
      email: userEmail || `${userData.login}@users.noreply.github.com`,
      displayName: userData.name || userData.login,
      username: userData.login,
      avatarUrl: userData.avatar_url,
      token: accessToken
    };

    // Return HTML bridge to communicate payload to client window
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SyntaxArena — GitHub Authenticated</title></head>
      <body style="background: #0e131d; color: #34d399; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center;">
          <h3 style="color: #38bdf8;">✓ GitHub Authentication Verified</h3>
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
        <h3>❌ GitHub Authentication Failed</h3>
        <p style="color: #94a3b8;">${err.message}</p>
        <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Close</button>
      </body>
      </html>
    `);
  }
}

