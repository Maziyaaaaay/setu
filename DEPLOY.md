# Deploy Setu

**Live: https://setu-india.netlify.app**
Netlify site `setu-india` (team `maziyaaaaay`), linked via `.netlify/state.json`.

## How the AI planner is powered

The Netlify **AI Gateway** is enabled on this team, so the function reads
`OPENAI_API_KEY` (a Netlify-issued token) and `OPENAI_BASE_URL`
(`https://setu-india.netlify.app/.netlify/ai`) **automatically at build time** —
no OpenAI key needs to be set on the site. The function calls
`${OPENAI_BASE_URL}/chat/completions`; if neither var is present it falls back to
`https://api.openai.com/v1` and a manually-set `OPENAI_API_KEY`.

Check it's alive:
```bash
curl -s https://setu-india.netlify.app/api/case-plan
# {"ok":true,"provider_configured":true,"model":"gpt-4o-mini"}
```

## Redeploy after a change

```bash
cd "/Users/maziyaaaaay/Documents/Codex/2026-08-28/https-www-youtube-com-watch-v"
npx netlify-cli deploy --prod --dir site
```

(You are already logged in as Mazin Kp. `./deploy.sh` does the same thing.)

**Important:** if the site is ever renamed, you must redeploy — `OPENAI_BASE_URL`
bakes the site name in at build time and goes stale otherwise.

## Verify (do this before recording / submitting)

Open **https://setu-india.netlify.app in an incognito window** and walk the whole
flow: what you need → check documents → what to do → practice login → send →
track → "show a document problem" → fixed → "how this would work for real".

On the plan screen the tag must read **"made by AI just now"** (green). Amber
**"backup plan"** means the function couldn't reach the model — check the health
curl above and the function logs at
`https://app.netlify.com/projects/setu-india/logs/functions`.

## Optional: use your own OpenAI key instead of the gateway

If you'd rather bill your own OpenAI account directly (more predictable for the
judging window):

```bash
npx netlify-cli env:set OPENAI_API_KEY "sk-proj-YOUR-KEY" --context production
npx netlify-cli env:set OPENAI_BASE_URL "https://api.openai.com/v1" --context production
npx netlify-cli deploy --prod --dir site
```

Site env vars override the gateway's injected values.

## Housekeeping

Four empty sites got created while finding a free name — delete them in the
Netlify dashboard (they hold nothing):
`setu-bwmi`, `setu-clear`, `setu-app-in`, `setu-india-demo`.
The old `helpful-pegasus-71571d` and the freed `sparkling-pika-cc8c39` are not used.

## Test locally

```bash
npx netlify-cli dev            # http://localhost:8888 — gateway works here too
cd site && python3 -m http.server 4173   # static only, shows the backup plan
```

## Files

| Path | What |
|---|---|
| `site/index.html`, `site/styles.css` | shell + styling |
| `site/catalog.js` | 16-service knowledge base (picker + AI grounding) |
| `site/app.js` | citizen journey + saved plan (localStorage) |
| `netlify/functions/case-plan.mjs` | serverless: goal → plan, strict JSON schema, gateway-aware |
| `netlify.toml` | `publish = site`, functions dir, `/api/*` redirect, Node 20 |
| `deploy.sh` | `netlify deploy --prod --dir site` |
