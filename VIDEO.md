# Setu — 2-minute video guide

Rules recap: **max 2:00**. Minute 1 = demo as a citizen. Minute 2 = how you built
it and why. A public link (Loom or unlisted YouTube). You present (solo).

Live site to record: **https://setu-blond-eight.vercel.app**

Aim for **1:45**. Judges watch a lot of these — a tight 1:45 that never drags beats
a full 2:00. Record the screen at a phone width (~400px) so it reads as mobile.

---

## What each judge should feel, and the beat that earns it

| Moment | Feeling you want | The beat that earns it |
|---|---|---|
| First 8 seconds | "I've seen this problem" | A real person with a real deadline, not "citizens face challenges" |
| The plan appears | "Oh — that's actually clearer" | A wall of portal rules vs. one plan with a reason for every line |
| Documents screen | "That's the thing that actually goes wrong" | The *mistake to avoid* line under each document |
| Fix-it screen | "That's a real product insight" | "One thing to fix — you don't start again", earlier steps intact |
| Minute 2, tools | "They built this properly" | Name exactly what each tool did — journey/data model vs. function/knowledge base |
| Scale screen | "They've thought past the demo" | API Setu / DigiLocker / CPGRAMS named, plus what's still fake |
| Last line | "Honest and confident" | Say plainly what's real and what's a practice screen |

---

## Shot list + script  (adapt wording to your voice — keep the structure)

### 0:00–0:10 — Hook  *(you on cam, or voiceover over the home screen)*

> "Anjali has a scholarship deadline in three weeks. She needs an income
> certificate. The website exists — what she can't find is which documents apply to
> *her*, and what to do if something's missing. That gap is where people miss the
> deadline."

Tone: calm, specific. Don't rush it — this is the whole reason Setu exists.

### 0:10–0:22 — Tell Setu what you need

On screen: pick **Income, residence or caste certificate**, reason **Scholarship**,
when **Within a month**, tap **Make my plan**.

> "She doesn't browse a list of services. She says one thing she needs."

Let the "Setu is making your plan…" spinner show for a beat, then the plan lands.

> "The plan is written live by an OpenAI model, using what this specific service
> actually needs."

*(The plan header must show the green **"made by AI just now"** tag. If it shows
amber **"backup plan"**, your OpenAI key isn't reaching the function — fix it
before recording.)*

### 0:22–0:45 — The plan + documents

Scroll the 4-step plan (DO NOW / ONLINE / IF NEEDED / TRACK). Tap **Check my
documents**.

> "Every document has why it's needed — and the mistake people actually make.
> 'Name spelt differently on different documents' is a top reason these get
> rejected. Setu says that *before* she travels anywhere."

Tap one or two documents to mark them **Have it**. Tap **See what to do**.

> "She marks what she has. The plan updates — what's still missing before she can
> apply."

### 0:45–1:00 — Practice application + the fix-it path  *(the money shot)*

Fast: **Try the practice application** → practice login (point at the "don't type a
real password / OTP / Aadhaar" line for half a second) → **Send practice
application** → the tracking screen.

> "Applying is a practice screen — no government system is touched. Now the part
> that matters."

Tap **Show a document problem**.

> "The office needs one more thing. Setu makes it one fix — what to do, where to get
> help, what happens after. Every step she already did stays done. She doesn't start
> over."

### 1:00–1:15 — What you changed and why

*(voiceover; you can show the **"What Setu changes"** screen)*

> "Today you piece a task together across many websites, offices and rules. Setu
> flips it: you say the goal, and get one plan — documents, where to go, how long,
> and how to fix problems. It's only a guide. It never approves or replaces an
> official decision."

### 1:15–1:35 — How you built it

> "I built the first working version with Codex — the whole citizen journey and the
> plan data model every screen renders from. My Codex limit ran out mid-build, so I
> used Claude Code for one part after that: the serverless function that calls the
> OpenAI model with a strict JSON schema, and the 16-service knowledge base that
> keeps the plans accurate. That's why adding a service is one knowledge-base entry,
> not a new hand-coded screen."

*(This matches the written disclosure in the submission. Say it plainly — honesty
is a scored criterion and using more than one tool is allowed.)*

### 1:35–1:50 — Scale + honesty

Show the **"See how this would work for real"** screen.

> "For real, Setu stays a thin layer: UMANG or DigiLocker to sign in and check
> documents with consent, the application sent to the real website through official
> API Setu links, status read back from the department, CPGRAMS to escalate, and a
> help centre for in-person cases. What works today is the journey and the AI plan.
> Signing in, sending the application, and the status are practice screens with
> made-up data — and the app says so on every screen."

### 1:50–1:55 — Close

> "Setu keeps you moving — so a government task doesn't fail just because the steps
> weren't clear."

---

## Recording checklist

- [ ] OpenAI key working → the plan shows the **green "made by AI just now"** tag
- [ ] Screen recorded at ~400px wide (mobile feel)
- [ ] Cleared the site's saved plan first (dev tools → Application → Local Storage →
      delete `setu:plan:v1`, or open in a private window) so there's no
      "Your saved plan" banner on the home screen
- [ ] No screen held longer than ~8 seconds, except the hook
- [ ] Total ≤ 2:00 (target 1:45)
- [ ] Uploaded as a public / unlisted link; opened it in a private window to confirm
- [ ] Audio clean (phone mic close, no room echo)
