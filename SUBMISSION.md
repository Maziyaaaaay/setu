# Setu — submission kit

Independent prototype for **Build What Moves India** (Varun Mayya × OpenAI).
Solo builder. Deadline: 28 Aug 2026, 8:00 PM IST.

---

## Project name

**Setu — public-service journeys, made clear**

## Live link

Production: https://helpful-pegasus-71571d.netlify.app
(no login wall; opens straight into the citizen journey)

Mock credentials for the simulated official-service step (shown pre-filled on screen):
`anjali.demo@setu.test` / `demo1234` — these connect to nothing.

---

## Project summary (240 words)

Millions of Indians lose time, money or an opportunity — not because a portal is
missing, but because the *journey* around it is unclear: which documents apply to
them, whether a step is online or needs a visit, where the application has reached,
and what to do when it stalls. UMANG puts services in one place; it does not make
any single journey easy to follow.

Setu is a mobile-first "life-event layer." A citizen states one goal — an income
certificate for a scholarship, a PF withdrawal, a pensioner's life certificate — and
Setu turns it into one case: a plain-language plan, a document checklist with the
reason and the common mistake for each item, the correct route (online, assisted, or
in-person verification), a realistic timeframe, and a recovery path that resolves one
missing item instead of restarting.

The plan is generated at request time by an OpenAI model, grounded in a curated
description of each service, so Setu covers 16 services today and extends to new ones
without hand-writing every flow.

Working now: the full citizen journey and the AI-generated plan, on a live public
link. Mocked and clearly labelled: identity sign-in, portal submission, department
status, and the CPGRAMS escalation. At scale Setu stays a thin layer — UMANG /
DigiLocker identity, consented document checks, submission through authorised API
Setu channels, status read back from the owning department, and an assisted mode for
Common Service Centres.

Built with Codex and Claude Code. Not affiliated with UMANG or any government body.

---

## How Codex was used

> Confirm the split below is accurate to how you actually worked, then paste it.
> "Honesty" is a judged criterion and the rules allow more than one AI tool as long
> as Codex was meaningfully involved and you disclose the rest.

Codex was the primary build tool. It was used to:

- build the first working prototype — the mobile-first citizen journey and every
  screen state (what you need → plan → documents → practice application → track →
  fix);
- shape the plan data model that the whole app renders from (route stages,
  document objects with reason + common mistake, things-that-go-wrong, the fix-it
  object).

Claude Code was used for one later block of work, after the Codex usage limit was
hit mid-build: the Netlify serverless function that calls the OpenAI model with a
strict JSON schema, the 16-service knowledge base that grounds it, and a
plain-language pass over all copy.

Libraries/frameworks: none. Static frontend + one Netlify Function. No UI
framework, no third-party runtime code.

---

## What works today vs what is mocked

| Real, working end-to-end | Mocked (clearly labelled in-app) |
|---|---|
| The whole citizen journey on a live link | Identity / UMANG sign-in |
| AI-generated plan per service (OpenAI model, live) | Submission to the real portal |
| 16 services across 6 categories | Department review + status updates |
| Your documents saved to your plan (localStorage) | The CPGRAMS escalation handoff |
| The fix-it path for a missing document | The reference number `SETU-260828-1842` |
| A backup plan if the API is unreachable (shown tagged) | — |

Disclosures in the product: a "DEMO · NOT OFFICIAL" badge on every screen; a footer
reading "AI-written guidance · Practice screens and made-up data · Not linked to
UMANG or any government body"; "Practice — not the real website" headings on the
application screens; an explicit "do not type a real password, OTP, Aadhaar or any
real detail" warning on the practice login; the plan tagged "made by AI just now"
vs "backup plan"; and a "What is real in this demo" panel on the scale screen.

---

## Judging-criteria self-check

- **Problem** — fragmented public-service journeys; a real, common, high-stakes pain.
- **Working build** — full journey works on a live link; the plan is genuinely
  model-generated, not canned.
- **Usability** — one goal in, one plan out; plain language; mobile-first; every
  document carries its reason and its common mistake.
- **Product thinking** — narrow "clarity layer" scope; does not replace any official
  decision; recovery-not-restart; honest fallback.
- **End-to-end thinking** — "How Setu works at scale" screen: identity, consented
  DigiLocker checks, API Setu submission, department status, CPGRAMS, assisted mode.
- **Honesty** — real-vs-mock stated on-screen and above.

---

## Submission-form checklist

- [ ] OpenAI billing topped up; key created and tested (`DEPLOY.md` step 1)
- [ ] `npx netlify-cli login` done, then `./deploy.sh` run; live link opens with no access request
- [ ] Plan shows the green "made by AI just now" tag (not amber "backup plan")
- [ ] Walked the full flow once in an incognito window
- [ ] Video (≤ 2:00) recorded and uploaded to a public link (Loom / unlisted YouTube)
- [ ] Summary pasted (under 250 words)
- [ ] Partner email field left **blank** (solo)
- [ ] Same email used that you registered with
- [ ] Submitted 30–45 min before 8:00 PM IST
