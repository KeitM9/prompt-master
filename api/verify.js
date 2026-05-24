module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ valid: false });

    // Старый общий пароль — обратная совместимость
    if (token === 'master2024') return res.status(200).json({ valid: true });

    // Токен администратора — всегда валиден
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    if (ADMIN_TOKEN && token === ADMIN_TOKEN) return res.status(200).json({ valid: true });

    // Код доступа для тарифа MASTER (курс)
    const COURSE_CODE = process.env.COURSE_CODE;
    if (COURSE_CODE && token === COURSE_CODE) return res.status(200).json({ valid: true });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/users?token=eq.${encodeURIComponent(token)}&paid=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    return res.status(200).json({ valid: Array.isArray(data) && data.length > 0 });
  } catch (e) {
    return res.status(500).json({ valid: false, error: e.message });
  }
};
