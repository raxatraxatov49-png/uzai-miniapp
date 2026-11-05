export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY sozlanmagan. Vercel Environment Variables bo‘limiga API kalitini kiriting.' });
  try {
    const { messages = [] } = req.body || {};
    const safeMessages = messages.slice(-20).map(m => ({
      role: ['user','assistant'].includes(m.role) ? m.role : 'user',
      content: m.content
    }));
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{role:'system',content:'Sen UzAI nomli foydali, aniq va samimiy sun’iy intellekt yordamchisisan. Foydalanuvchining tilida javob ber. Zarur bo‘lsa savol ber.'}, ...safeMessages], temperature: 0.7 })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'AI xizmati xatosi' });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'Javob olinmadi.' });
  } catch (e) { return res.status(500).json({ error: 'Server xatosi. Qayta urinib ko‘ring.' }); }
}