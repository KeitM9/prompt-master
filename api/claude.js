// Прокси APP → Claude. Закрыт по трём правилам: зовёт только свой сайт, модель и лимит
// выбирает сервер (белый список), тело клиента как есть не пересылается.
const ALLOWED_ORIGIN = /^https:\/\/(app\.arsysai\.com|prompt-master[a-z0-9-]*\.vercel\.app)$/;
const MODELS = new Set(['claude-haiku-4-5-20251001', 'claude-sonnet-4-5']); // то, что шлёт app/index.html
const MAX_TOKENS = 3000;   // максимум, который просит приложение (режим «Улучшить»)
const MAX_CHARS = 60000;   // system + messages вместе

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const ok = ALLOWED_ORIGIN.test(origin);
  if (ok) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // ponytail: Origin отсекает чужие сайты, но не curl. Следующий барьер — проверка токена
  // доступа на сервере (как в verify.js) и лимит трат в консоли Anthropic.
  if (!ok) return res.status(403).json({ error: 'forbidden' });

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'No API key' });

    const b = req.body || {};
    const model = MODELS.has(b.model) ? b.model : 'claude-sonnet-4-5';
    const max_tokens = Math.min(Math.max(parseInt(b.max_tokens, 10) || 1000, 1), MAX_TOKENS);
    const system = typeof b.system === 'string' ? b.system : undefined;
    const messages = Array.isArray(b.messages)
      ? b.messages.filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map(m => ({ role: m.role, content: m.content }))
      : [];
    if (!messages.length) return res.status(400).json({ error: 'No messages' });
    const size = (system || '').length + messages.reduce((n, m) => n + m.content.length, 0);
    if (size > MAX_CHARS) return res.status(413).json({ error: 'Too long' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens, ...(system ? { system } : {}), messages })
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
