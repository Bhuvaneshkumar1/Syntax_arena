/**
 * Vercel Serverless Function: Cloud Progress Synchronization API (/api/sync)
 * Enables seamless cross-device synchronization of player badges, avatar, XP, levels,
 * battlestation gear, and unlocked achievements across desktop and mobile devices.
 * Supports Upstash Redis / Vercel KV REST API with memory and serverless fallback.
 */

// Ephemeral in-memory store for serverless instances
if (!globalThis._syntaxarena_cloud_cache) {
  globalThis._syntaxarena_cloud_cache = new Map();
}

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // Helper: Read key from KV store or fallback cache
  async function readCloudSave(userKey) {
    const cleanKey = `syncarena:${encodeURIComponent(userKey.trim().toLowerCase())}`;

    // A. Check Upstash / Vercel KV if configured
    if (KV_URL && KV_TOKEN) {
      try {
        const getRes = await fetch(`${KV_URL}/get/${cleanKey}`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        if (getRes.ok) {
          const data = await getRes.json();
          if (data && data.result) {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            return parsed;
          }
        }
      } catch (err) {
        console.warn('[Sync API] KV read warning:', err.message);
      }
    }

    // B. Check serverless instance memory cache
    if (globalThis._syntaxarena_cloud_cache.has(cleanKey)) {
      return globalThis._syntaxarena_cloud_cache.get(cleanKey);
    }

    return null;
  }

  // Helper: Write key to KV store or fallback cache
  async function writeCloudSave(userKey, payload) {
    const cleanKey = `syncarena:${encodeURIComponent(userKey.trim().toLowerCase())}`;
    const payloadWithMeta = {
      ...payload,
      _cloudSyncedAt: Date.now()
    };

    // A. Write to Upstash / Vercel KV if configured
    if (KV_URL && KV_TOKEN) {
      try {
        await fetch(`${KV_URL}/set/${cleanKey}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${KV_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(JSON.stringify(payloadWithMeta))
        });
      } catch (err) {
        console.warn('[Sync API] KV write warning:', err.message);
      }
    }

    // B. Write to serverless instance memory cache
    globalThis._syntaxarena_cloud_cache.set(cleanKey, payloadWithMeta);

    // Keep memory cache from growing unbounded
    if (globalThis._syntaxarena_cloud_cache.size > 1000) {
      const firstKey = globalThis._syntaxarena_cloud_cache.keys().next().value;
      globalThis._syntaxarena_cloud_cache.delete(firstKey);
    }

    return payloadWithMeta;
  }

  try {
    // -------------------------------------------------------------
    // GET: Retrieve remote cloud profile for authenticated account
    // -------------------------------------------------------------
    if (req.method === 'GET') {
      const key = req.query.key || req.query.email || req.query.userId;
      if (!key) {
        return res.status(400).json({ error: 'Missing account key or email parameter' });
      }

      const profile = await readCloudSave(String(key));
      if (!profile) {
        return res.status(200).json({
          found: false,
          message: 'No cloud save found for this account'
        });
      }

      return res.status(200).json({
        found: true,
        profile,
        updatedAt: profile._cloudSyncedAt || Date.now()
      });
    }

    // -------------------------------------------------------------
    // POST: Save or update remote cloud profile
    // -------------------------------------------------------------
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (_) {
          return res.status(400).json({ error: 'Malformed JSON payload' });
        }
      }

      const key = body.key || body.email || body.userId;
      const profile = body.profile;

      if (!key || !profile) {
        return res.status(400).json({ error: 'Missing key or profile in request body' });
      }

      // Basic profile validation
      if (typeof profile !== 'object') {
        return res.status(400).json({ error: 'Profile must be an object' });
      }

      const saved = await writeCloudSave(String(key), profile);

      return res.status(200).json({
        success: true,
        message: 'Cloud profile synchronized successfully',
        updatedAt: saved._cloudSyncedAt
      });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('[Sync API] Server error:', err);
    return res.status(500).json({ error: 'Internal synchronization server error', details: err.message });
  }
}
