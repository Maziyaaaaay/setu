# Deploy Setu

Live site: **https://helpful-pegasus-71571d.netlify.app** (Netlify site
`helpful-pegasus-71571d`, already linked via `.netlify/state.json`).

Two things only you can do (Netlify login + your OpenAI key). Then one script
does the rest.

---

## Step 1 — OpenAI key (you)

1. https://platform.openai.com/settings/organization/billing → add a card + at
   least **$5** credit. (`gpt-4o-mini` costs a fraction of a cent per plan.)
2. https://platform.openai.com/api-keys → create key → copy (`sk-...`).
3. Test it:
   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer sk-REPLACE_ME" -H "Content-Type: application/json" \
     -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}'
   ```
   `"choices"` in the reply = good. `"insufficient_quota"` = credit not landed yet.

## Step 2 — Netlify login (you)

```bash
npx netlify-cli login
```

A browser tab opens → click **Authorize**. That stores a token on this machine;
everything after this can be scripted.

## Step 3 — set the key + deploy

Put the key in your shell, then run the deploy script:

```bash
cd "/Users/maziyaaaaay/Documents/Codex/2026-08-28/https-www-youtube-com-watch-v"
export OPENAI_API_KEY=sk-REPLACE_ME
./deploy.sh
```

`deploy.sh` links the site, pushes `OPENAI_API_KEY` to Netlify, and runs
`netlify deploy --prod --dir site`. It prints the live URL.

(Prefer the dashboard for the key? Netlify → Site configuration → Environment
variables → add `OPENAI_API_KEY`, then just `./deploy.sh`.)

## Step 4 — check (you or me)

Open the printed URL **in an incognito window** and walk the whole flow:
what you need → check documents → what to do → practice login → send →
track → "show a document problem" → fixed → "how this would work for real".

On the plan screen, the tag should read **"made by AI just now"** (green). If it
reads **"backup plan"** (amber), the key isn't reaching the function — check
Step 1 and `npx netlify-cli env:get OPENAI_API_KEY`.

---

## Test locally first (optional)

```bash
npx netlify-cli dev            # http://localhost:8888, needs OPENAI_API_KEY exported
```

Static-only (no live AI, shows the backup plan) — from the `site/` folder:
```bash
cd site && python3 -m http.server 4173
```

## If Netlify login fails before 8 PM (last resort)

Drag the **`site/`** folder onto https://app.netlify.com/drop for a public link.
Functions don't run this way, so the planner shows its backup plan — say so in
the video if you go this route.

## Files

| Path | What |
|---|---|
| `site/index.html`, `site/styles.css` | shell + styling |
| `site/catalog.js` | 16-service knowledge base (picker + AI grounding) |
| `site/app.js` | citizen journey + saved plan (localStorage) |
| `netlify/functions/case-plan.mjs` | serverless: goal → plan via OpenAI, strict JSON schema |
| `netlify.toml` | `publish = site`, functions dir, `/api/*` redirect, Node 20 |
| `deploy.sh` | link + env:set + `deploy --prod` |
