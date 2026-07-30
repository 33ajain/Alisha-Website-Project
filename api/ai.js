// api/ai.js
// Vercel-style serverless function. Deploy this file at /api/ai.js (Vercel) or adjust for your platform.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "message" in request body' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server is not configured: missing OPENAI_API_KEY' });
    }

    // construct a compact prompt that helps the model behave like a book recommender
    const system = `You are a helpful assistant that recommends books for middle-grade and young adult readers. Keep answers concise (3 recommendations), include title and author, and optionally one sentence explaining why. If the user lists books, use them to infer genre or tone.`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.8
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenAI error', resp.status, text);
      return res.status(502).json({ error: 'Upstream AI error', detail: text });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? null;
    if (!reply) {
      return res.status(502).json({ error: 'No reply from AI' });
    }

    // return reply as plain text
    return res.status(200).json({ reply: reply });

  } catch (err) {
    console.error('Handler error', err);
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
