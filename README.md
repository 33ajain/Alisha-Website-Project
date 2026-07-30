# Alisha-Website-Project — AI Book Assistant

This branch adds a Tiny AI chat widget to the homepage and a serverless proxy function to call OpenAI safely.

What was added

- index.html (updated) — the site now includes an accessible, responsive AI chat widget that sends user messages to `/api/ai`. It has a local fallback so the widget still returns recommendations if the serverless function is unreachable.
- api/ai.js — a Vercel-style serverless function that accepts POST { message } and forwards it to OpenAI using the `OPENAI_API_KEY` environment variable. It returns `{ reply }` JSON to the client.

Why this setup

- API keys must not be exposed to browsers. The serverless function keeps your OpenAI key secret.
- Using a function (Vercel/Netlify) makes deployment simple for static sites.

Deployment (recommended: Vercel)

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```
2. In the Vercel dashboard, create a new project from this GitHub repo.
3. In Project Settings → Environment Variables, add `OPENAI_API_KEY` with your OpenAI API key.
4. Deploy. The function will be available at `https://<your-site>/api/ai`.

Local testing with `vercel dev`:

1. Set the environment variable locally:
   ```bash
   export OPENAI_API_KEY=sk-....
   vercel dev
   ```
2. Open `http://localhost:3000` and use the AI widget.

If you prefer Netlify, place `api/ai.js` into `netlify/functions/ai.js` and use Netlify Functions (or adapt accordingly).

Security & cost notes

- Protect your API key and consider limiting requests to the function (rate limiting or authentication) before public production use to avoid abuse and unexpected charges.
- Monitor usage in your OpenAI dashboard.

If you'd like, I can also:

- Add an Express server alternative (`server.js`) for DIY deployment.
- Add a simple rate-limiter (IP-based) to the serverless function.
- Create a Pull Request from this branch and open it for review/merge.

Tell me how you'd like me to proceed (I can open a PR and/or deploy to Vercel if you authorize access).