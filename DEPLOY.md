# Deploy Setu

**Primary (submission): https://setu-blond-eight.vercel.app** — Vercel, auto-deploys
on every push to `main`.
**Backup: https://setu-india.netlify.app** — Netlify, deploy with `./deploy.sh`.

The function logic is shared: `lib/case-plan-core.mjs`, with thin entry points
`api/case-plan.js` (Vercel, edge) and `netlify/functions/case-plan.mjs` (Netlify).

## How the AI planner is powered

The function reads `OPENAI_API_KEY` and optional `OPENAI_BASE_URL` from the
environment. `OPENAI_BASE_URL` defaults to `https://api.openai.com/v1`.

- **Vercel:** `OPENAI_API_KEY` is set in Project → Settings → Environment
  Variables (your own OpenAI key, billed to your account). No base URL override.
- **Netlify:** the team's Netlify AI Gateway injects both vars automatically at
  build time, so nothing needs to be set there.

Health check either host:
```bash
curl -s https://setu-blond-eight.vercel.app/api/case-plan
# {"ok":true,"provider_configured":true,"model":"gpt-4o-mini"}
```

## Redeploy

- **Vercel:** just `git push`. Or Vercel dashboard → Deployments → Redeploy.
- **Netlify:** `./deploy.sh` (you're logged in as Mazin Kp).

If you rename the Netlify site, you must redeploy it — `OPENAI_BASE_URL` bakes the
site name in at build time.

## Vercel project settings that matter

- **Deployment Protection → Vercel Authentication: Disabled** (required — otherwise
  the URL shows a Vercel login wall and fails the "opens without access" rule).
- **Environment Variables:** `OPENAI_API_KEY` present, scope includes Production.
- Framework preset: Other. No build command. Output directory: `site` (from
  `vercel.json`).
- Want a cleaner URL? Settings → Domains → add e.g. `setu-app.vercel.app` if free.

## Verify before recording / submitting

Open the URL **in an incognito window** and walk the whole flow: what you need →
check documents → what to do → practice login → send → track → "show a document
problem" → fixed → "how this would work for real".

The plan header must read **"made by AI just now"** (green). Amber **"backup plan"**
means the function couldn't reach the model — check the health curl and, on Vercel,
Deployments → latest → Functions logs.

## Test locally

```bash
# Vercel-style (needs OPENAI_API_KEY exported):
npx vercel dev

# Netlify-style (AI gateway works here if logged in):
npx netlify-cli dev

# Static only (shows the backup plan):
cd site && python3 -m http.server 4173
```

## Files

| Path | What |
|---|---|
| `site/index.html`, `site/styles.css` | shell + styling |
| `site/catalog.js` | 16-service knowledge base (picker + AI grounding) |
| `site/app.js` | citizen journey + saved plan (localStorage) |
| `lib/case-plan-core.mjs` | shared function logic: goal → plan, strict JSON schema |
| `api/case-plan.js` | Vercel entry (edge runtime) |
| `netlify/functions/case-plan.mjs` | Netlify entry |
| `vercel.json` / `netlify.toml` | host config |
| `deploy.sh` | Netlify redeploy helper |
