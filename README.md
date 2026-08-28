# Setu

A mobile-first "life-event layer" for Indian public-service journeys, built for the
**Build What Moves India** hackathon (Varun Mayya × OpenAI).

**Live: https://setu-india.netlify.app**

A citizen states one goal; an OpenAI model turns it into one case — a plain-language
plan, a document checklist with reasons and common mistakes, the right route
(online / assisted / verification), a timeframe, and a recovery path.

## Architecture

```
browser (site/index.html + site/catalog.js + site/app.js)
        │  POST /api/case-plan  { service, notes, purpose, timing }
        ▼
Netlify Function (netlify/functions/case-plan.mjs)
        │  OpenAI chat.completions, gpt-4o-mini, strict JSON schema
        ▼
        { plan: { summary, timeframe, route[], documents[], pitfalls[], recovery } }
```

- No framework, no build step, no third-party JS.
- Case state (goal, timing, document readiness) persists in `localStorage`.
- If the function is unreachable, the frontend renders a bundled fallback plan,
  tagged "offline plan" so it is never mistaken for the live output.

## Run locally

Static only (planner shows the backup plan):

```sh
cd site && python3 -m http.server 4173   # http://localhost:4173
```

With the live AI planner:

```sh
npx netlify-cli dev            # http://localhost:8888  — needs OPENAI_API_KEY exported
```

## Deploy

Already live at https://setu-india.netlify.app. To redeploy after a change:
`npx netlify-cli deploy --prod --dir site` (or `./deploy.sh`). The AI planner is
powered by the Netlify AI Gateway — no OpenAI key needs to be set. See `DEPLOY.md`.

## Submission

- `SUBMISSION.md` — project summary, Codex/Claude disclosure, real-vs-mock table, form checklist
- `VIDEO.md` — 2-minute video script and shot list

## Add a service

Append one entry to `CATALOG` in `site/catalog.js` (id, label, category, portal,
purposes, notes). The `notes` field is the grounding sent to the model — no code
changes needed.

## Disclosures

Independent demo. Made-up data, practice screens, AI-written guidance. Not linked to
UMANG or any government body. Does not connect to any government system.
