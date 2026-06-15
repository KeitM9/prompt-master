// Keep-alive: лёгкий запрос к Supabase, чтобы база на Free-тарифе не засыпала.
// Вызывается Vercel Cron раз в сутки (см. vercel.json).
module.exports = async function handler(req, res) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ ok: false, error: 'DB not configured' });
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    return res.status(200).json({ ok: r.ok, status: r.status, ts: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
