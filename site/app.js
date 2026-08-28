/* Setu — citizen prototype.
   Small hand-rolled view layer. The plan (steps, documents, what-goes-wrong,
   how-to-fix) comes from the AI planner at /api/case-plan.
   The plan and your progress are saved in localStorage so you have ONE plan
   to come back to. Copy is kept to plain, everyday words. */

const app = document.querySelector('#app');
const q = (sel) => document.querySelector(sel);
const API = '/api/case-plan';
const STORE = 'setu:plan:v1';

const FRESH = () => ({
  serviceId: CATALOG[0].id,
  purpose: '',
  timing: 'within-month',
  date: '',
  plan: null,
  planSource: null,   // 'ai' | 'fallback'
  docsReady: {}        // document name -> boolean
});

let state = load() || FRESH();

function load() { try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; } }
function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* private window */ } }
function reset() { try { localStorage.removeItem(STORE); } catch {} state = FRESH(); home(); }

const svc = () => CATALOG.find((s) => s.id === state.serviceId) || CATALOG[0];

function timingText() {
  return state.timing === 'within-week' ? 'within 7 days'
    : state.timing === 'within-month' ? 'within a month'
    : state.timing === 'exact' && state.date ? `by ${state.date}`
    : 'with no fixed date';
}

/* ---------- shell ---------- */

const layout = (body) => `<div class="app">
  <header class="top"><div class="brand">se<span>·</span>tu</div><div class="badge">DEMO · NOT OFFICIAL</div></header>
  <section class="page">${body}</section>
  <footer class="disclaimer">AI-written guidance · Practice screens and made-up data · Not linked to UMANG or any government body</footer>
</div>`;

function nav(active) {
  const b = (k, i, l) => `<button class="${active === k ? 'active' : ''}" data-nav="${k}"><b>${i}</b>${l}</button>`;
  return `<nav class="nav">${b('home', '⌂', 'Home')}${b('dash', '▣', 'My plan')}${b('help', '?', 'About')}</nav>`;
}
function bindNav() {
  document.querySelectorAll('[data-nav]').forEach((x) => {
    x.onclick = () => {
      const k = x.dataset.nav;
      if (k === 'home') home();
      else if (k === 'dash') state.plan ? dashboard() : home();
      else help();
    };
  });
}

/* ---------- home ---------- */

function groupedOptions() {
  const cats = [...new Set(CATALOG.map((s) => s.category))];
  return cats.map((c) =>
    `<optgroup label="${c}">` +
    CATALOG.filter((s) => s.category === c)
      .map((s) => `<option value="${s.id}"${s.id === state.serviceId ? ' selected' : ''}>${s.label}</option>`)
      .join('') +
    `</optgroup>`
  ).join('');
}
function purposeOptions() {
  return `<option value="">Choose a reason</option>` +
    svc().purposes.map((p) => `<option${p === state.purpose ? ' selected' : ''}>${p}</option>`).join('');
}

function home() {
  const resume = state.plan
    ? `<div class="next"><b>Your saved plan</b><p>${svc().label} · ${timingText()}</p>
        <button class="text" id="resume">Open it →</button></div>`
    : '';

  app.innerHTML = layout(`
    <div class="hero">
      <div class="eyebrow">A simpler way through government services</div>
      <h1>Don’t lose out because a government process is confusing.</h1>
      <p>Tell Setu what you need from the government. Get one clear plan — what to do, what to bring, and what happens next.</p>
    </div>
    ${resume}
    <div class="card">
      <h3>Tell Setu what you need</h3>
      <p class="sub" style="font-size:14px;margin-top:2px">Pick what you need. Setu makes the plan.</p>
      <div class="field">
        <label>What do you need?</label>
        <select id="service">${groupedOptions()}</select>
        <small id="svcNote">Where this is done: ${svc().portal}</small>
      </div>
      <div class="field">
        <label>Why do you need it?</label>
        <select id="purpose">${purposeOptions()}</select>
        <small>This helps Setu make a better plan.</small>
      </div>
      <div class="field">
        <label>When do you need it?</label>
        <select id="time">
          <option value="no-deadline"${state.timing === 'no-deadline' ? ' selected' : ''}>No fixed date</option>
          <option value="within-week"${state.timing === 'within-week' ? ' selected' : ''}>Within 7 days</option>
          <option value="within-month"${state.timing === 'within-month' ? ' selected' : ''}>Within a month</option>
          <option value="exact"${state.timing === 'exact' ? ' selected' : ''}>Pick a date</option>
        </select>
        <div id="dateWrap" class="${state.timing === 'exact' ? '' : 'hidden'}">
          <label style="margin-top:12px">Which date?</label>
          <input id="date" type="date" value="${state.date || ''}">
        </div>
      </div>
      <button class="btn" id="start">Make my plan →</button>
    </div>
    <div class="card">
      <div class="feature"><i>1</i><span><b>Know where to go</b><br>Online, at a help centre, or in person — Setu tells you which.</span></div>
      <div class="feature"><i>2</i><span><b>Bring the right documents</b><br>With the reason for each one, and the mistake to avoid.</span></div>
      <div class="feature"><i>3</i><span><b>Always know the next step</b><br>If something gets stuck, Setu tells you how to fix it.</span></div>
    </div>
    ${nav('home')}`);

  const s = q('#service'), pp = q('#purpose'), t = q('#time');
  s.onchange = () => { state.serviceId = s.value; state.purpose = ''; save(); home(); };
  pp.onchange = () => { state.purpose = pp.value; save(); };
  t.onchange = () => {
    state.timing = t.value;
    q('#dateWrap').classList.toggle('hidden', t.value !== 'exact');
    save();
  };
  const d = q('#date');
  if (d) d.onchange = () => { state.date = d.value; save(); };
  q('#start').onclick = () => { if (q('#date')) state.date = q('#date').value; save(); createPlan(); };
  if (q('#resume')) q('#resume').onclick = dashboard;
  bindNav();
}

/* ---------- AI planner call ---------- */

function loading() {
  app.innerHTML = layout(`
    <div class="loading">
      <div class="spinner"></div>
      <b>Setu is making your plan…</b>
      <p class="sub">Working out your steps, documents, and what to do if something goes wrong.</p>
    </div>`);
}

async function createPlan() {
  loading();
  const s = svc();
  let plan, planSource;
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service: s.label, category: s.category, portal: s.portal, notes: s.notes,
        purpose: state.purpose, timing: timingText()
      })
    });
    const data = await res.json();
    if (data && data.plan && Array.isArray(data.plan.route) && Array.isArray(data.plan.documents)) {
      plan = data.plan;
      planSource = 'ai';
    } else {
      plan = fallbackPlan(s);
      planSource = 'fallback';
    }
  } catch {
    plan = fallbackPlan(s);
    planSource = 'fallback';
  }
  state.plan = plan;
  state.planSource = planSource;
  state.docsReady = {};
  save();
  dashboard();
}

function fallbackPlan(s) {
  return {
    summary: `This is a general guide for “${s.label}”. Setu could not reach its planner just now, so this is not made for your exact case. Please check the current steps on ${s.portal}.`,
    timeframe: 'Depends on your state and on how complete your application is — check the official website.',
    route: [
      { stage: 'DO NOW', title: 'Get your documents ready', detail: 'Collect your ID, address proof and any proof for your reason before you start.', channel: 'self' },
      { stage: 'ONLINE', title: 'Apply on the official website', detail: `Start on ${s.portal}. Fill in the details carefully and save the reference number.`, channel: 'online' },
      { stage: 'IF NEEDED', title: 'In-person help', detail: 'If a step needs checking in person, a help centre (CSC) can do it with you. Carry the originals.', channel: 'assisted' },
      { stage: 'TRACK', title: 'Track and fix', detail: 'Check the status often. If something is missing, reply to that request — do not apply again.', channel: 'track' }
    ],
    documents: [
      { name: 'ID proof', why: 'Shows who is applying.', commonMistake: 'Name spelt differently on different documents.' },
      { name: 'Address proof', why: 'Sends your application to the right local office.', commonMistake: 'Using an old address that no longer matches.' },
      { name: 'Proof for your reason', why: `Backs up why you need this: ${state.purpose || 'your reason'}.`, commonMistake: 'Bringing a photocopy when the original is needed.' }
    ],
    pitfalls: [
      'Starting the application before your documents are ready.',
      'Not saving the reference number after you apply.',
      'Missing a follow-up request and having to start again.'
    ],
    recovery: {
      item: 'A document the office could not read or accept',
      what: 'The office needs one clearer or extra proof. Your application is not cancelled.',
      where: 'Upload it on the website, or take the original to a help centre (CSC).',
      after: 'Your earlier steps stay saved. The check carries on from where it stopped.'
    }
  };
}

/* ---------- your plan ---------- */

const CH_LABEL = { self: 'DO NOW', online: 'ONLINE', assisted: 'IF NEEDED', track: 'TRACK' };

function routeTimeline(route) {
  return `<div class="timeline">` + route.map((r, i) => `
    <div class="event${i === 0 ? ' now' : ''}">
      <span class="dot">${i + 1}</span>
      <div>
        <span class="label${r.channel === 'assisted' ? ' offline' : ''}">${r.stage || CH_LABEL[r.channel] || ''}</span>
        <strong>${r.title}</strong><p>${r.detail}</p>
      </div>
    </div>`).join('') + `</div>`;
}

function dashboard() {
  const p = state.plan, s = svc();
  const ready = Object.values(state.docsReady).filter(Boolean).length;
  app.innerHTML = layout(`
    <div class="case">
      <div class="over">Your plan · <span class="tag ${state.planSource === 'ai' ? 'ai' : 'fallback'}">${state.planSource === 'ai' ? 'made by AI just now' : 'backup plan'}</span></div>
      <h2>${s.label}</h2>
      <p>When: ${timingText()}${state.purpose ? ` · ${state.purpose}` : ''}</p>
    </div>
    <p class="sub">${p.summary}</p>
    <div class="top-row"><h2>Your next step</h2><span class="pill">${ready} of ${p.documents.length} documents ready</span></div>
    <div class="next">
      <b>${p.route[0].title}</b>
      <p>${p.route[0].detail}</p>
      <button class="text" id="docs">Check my documents →</button>
    </div>
    <div class="card">
      <h3>The full plan</h3>
      <p class="sub" style="margin-top:2px;font-size:13px">How long this usually takes: ${p.timeframe}</p>
      ${routeTimeline(p.route)}
    </div>
    ${nav('dash')}`);
  q('#docs').onclick = documents;
  bindNav();
}

/* ---------- documents ---------- */

function documents() {
  const p = state.plan;
  app.innerHTML = layout(`
    <div class="eyebrow">Where this is done: ${svc().portal}</div>
    <h2>Check your documents</h2>
    <p class="sub">Tap the ones you already have. Setu remembers them for you.</p>
    <div class="card">
      ${p.documents.map((d, i) => `
        <button class="doc ${state.docsReady[d.name] ? 'ready' : ''}" data-i="${i}">
          <span class="check">✓</span>
          <span>
            <strong>${d.name}</strong>
            <small>${d.why}</small>
            <small class="mistake">Mistake to avoid: ${d.commonMistake}</small>
          </span>
          <span class="status ${state.docsReady[d.name] ? '' : 'missing'}">${state.docsReady[d.name] ? 'Have it' : 'Need it'}</span>
        </button>`).join('')}
    </div>
    <div class="next"><b>Why this helps</b><p>You find out about a missing document now — not after standing in a queue.</p></div>
    <button class="btn" id="next">See what to do →</button>
    <button class="text" id="back">← Back</button>`);
  document.querySelectorAll('[data-i]').forEach((b) => {
    b.onclick = () => {
      const n = p.documents[+b.dataset.i].name;
      state.docsReady[n] = !state.docsReady[n];
      save();
      documents();
    };
  });
  q('#next').onclick = planScreen;
  q('#back').onclick = dashboard;
}

/* ---------- what to do ---------- */

function planScreen() {
  const p = state.plan;
  const missing = p.documents.filter((d) => !state.docsReady[d.name]);
  app.innerHTML = layout(`
    <div class="case">
      <div class="over">What to do</div>
      <h2>${svc().label}</h2>
      <p>${missing.length ? `${missing.length} document${missing.length > 1 ? 's' : ''} to get before you apply.` : 'You have everything. You’re ready to apply.'}</p>
    </div>
    <div class="card">
      <div class="timeline">
        <div class="event done"><span class="dot">✓</span><div><strong>Plan ready</strong><p>Your goal, date and documents are saved.</p></div></div>
        <div class="event now"><span class="dot">!</span><div>
          <strong>${missing.length ? 'Get the missing documents' : 'Ready to apply'}</strong>
          <p>${missing.length ? 'You still need: ' + missing.map((m) => m.name).join(', ') + '.' : 'Go to the next step.'}</p>
        </div></div>
        <div class="event"><span class="dot">3</span><div><strong>Apply</strong><p>A practice login and a filled-in form, safe to try.</p></div></div>
        <div class="event"><span class="dot">4</span><div><strong>Track and fix</strong><p>See what to do if your application gets stuck.</p></div></div>
      </div>
    </div>
    <div class="card"><h3>Things that go wrong</h3><ul class="pitfalls">${p.pitfalls.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <button class="btn" id="go">Try the practice application →</button>
    <button class="text" id="back">← Change my documents</button>`);
  q('#go').onclick = login;
  q('#back').onclick = documents;
}

/* ---------- practice application ---------- */

function login() {
  app.innerHTML = layout(`
    <div class="eyebrow">Practice — not the real website</div>
    <h2>Sign in</h2>
    <p class="sub">This is a practice screen. Do not type a real password, OTP, Aadhaar or any real detail.</p>
    <div class="card">
      <div class="field"><label>Practice email</label><input value="anjali.demo@setu.test"></div>
      <div class="field"><label>Practice password</label><input type="password" value="demo1234"></div>
      <div class="objective" style="margin:12px 0"><b>Practice only</b><p>These boxes are not connected to any government website.</p></div>
      <button class="btn" id="in">Continue →</button>
    </div>
    <button class="text" id="back">← Back</button>`);
  q('#in').onclick = request;
  q('#back').onclick = planScreen;
}

function request() {
  const p = state.plan, s = svc();
  const ready = Object.values(state.docsReady).filter(Boolean).length;
  app.innerHTML = layout(`
    <div class="eyebrow">Practice application</div>
    <h2>Check before you send</h2>
    <p class="sub">Setu fills in what it already knows.</p>
    <div class="card">
      <div class="feature"><i>✓</i><span><b>Service</b><br>${s.label}</span></div>
      <div class="feature"><i>✓</i><span><b>What you need it for</b><br>${state.purpose || 'General'} · ${timingText()}</span></div>
      <div class="feature"><i>✓</i><span><b>Documents</b><br>${ready} of ${p.documents.length} marked as ready</span></div>
    </div>
    <div class="next"><b>Before you send</b><p>This only makes a practice tracking number. Nothing is sent anywhere.</p></div>
    <button class="btn" id="submit">Send practice application →</button>
    <button class="text" id="back">← Back</button>`);
  q('#submit').onclick = tracking;
  q('#back').onclick = login;
}

function tracking() {
  const s = svc();
  app.innerHTML = layout(`
    <div class="case">
      <div class="over">Practice application sent</div>
      <h2>SETU-260828-1842</h2>
      <p>${s.label} · sent today</p>
    </div>
    <div class="top-row"><h2>Track your application</h2><span class="pill">Being checked</span></div>
    <div class="card">
      <div class="timeline">
        <div class="event done"><span class="dot">✓</span><div><strong>Application sent</strong><p>Your details and document list were received.</p></div></div>
        <div class="event now"><span class="dot">!</span><div><strong>Documents being checked</strong><p>This stays in the same plan as your goal.</p></div></div>
        <div class="event"><span class="dot">3</span><div><strong>Result</strong><p>When it’s done, your plan shows the next step.</p></div></div>
      </div>
    </div>
    <div class="next"><b>See how Setu helps if something goes wrong</b><p>Try it: a document problem.</p>
      <button class="text" id="issue">Show a document problem →</button></div>
    <button class="btn secondary" id="finish">Finish →</button>`);
  q('#issue').onclick = recovery;
  q('#finish').onclick = complete;
}

function recovery() {
  const r = state.plan.recovery;
  app.innerHTML = layout(`
    <div class="eyebrow">Something needs fixing</div>
    <h2>One thing to fix.<br>You don’t start again.</h2>
    <p class="sub">The office needs one more thing for your ${svc().label.toLowerCase()} application.</p>
    <div class="card">
      <span class="status missing">NEEDS ACTION</span>
      <h3 style="margin-top:12px">${r.item}</h3>
      <p class="sub" style="font-size:14px">${r.what}</p>
      <div class="feature"><i>1</i><span><b>What to do</b><br>${r.where}</span></div>
      <div class="feature"><i>2</i><span><b>After that</b><br>${r.after}</span></div>
    </div>
    <button class="btn" id="done">Mark as fixed →</button>`);
  q('#done').onclick = complete;
}

/* ---------- close ---------- */

function complete() {
  app.innerHTML = layout(`
    <div class="hero">
      <div class="eyebrow">End of demo</div>
      <h1>Setu keeps you moving.</h1>
      <p>A government task shouldn’t fail just because the steps weren’t clear.</p>
    </div>
    <div class="card">
      <h3>What Setu changes</h3>
      <div class="feature"><i>!</i><span><b>Before</b><br>You search across many websites, offices and rules to piece it together.</span></div>
      <div class="feature"><i>→</i><span><b>With Setu</b><br>One plan: your goal, the date, the documents, where to go, and how to fix problems.</span></div>
      <div class="feature"><i>✓</i><span><b>Result</b><br>You always know the next step.</span></div>
    </div>
    <button class="btn" id="scale">See how this would work for real →</button>
    <button class="text" id="again">Start again →</button>`);
  q('#scale').onclick = scale;
  q('#again').onclick = reset;
}

function scale() {
  app.innerHTML = layout(`
    <div class="eyebrow">How this would work for real</div>
    <h2>Setu sits on top.<br>It doesn’t replace anything.</h2>
    <p class="sub">Setu guides you. The government websites still do the real work.</p>
    <div class="card">
      <div class="feature"><i>1</i><span><b>Signing in</b><br>You sign in with UMANG or DigiLocker. Setu never sees your password.</span></div>
      <div class="feature"><i>2</i><span><b>Documents</b><br>Setu checks your DigiLocker documents with your permission, then forgets them.</span></div>
      <div class="feature"><i>3</i><span><b>Applying</b><br>Your application goes to the real website — eDistrict, EPFO, Parivahan — through official links (API Setu).</span></div>
      <div class="feature"><i>4</i><span><b>Status</b><br>The status comes back from the government office. A stuck case can be raised on CPGRAMS.</span></div>
      <div class="feature"><i>5</i><span><b>In-person help</b><br>A help centre (CSC) can do the same steps with you.</span></div>
    </div>
    <div class="objective">
      <b>What is real in this demo</b>
      <p>The journey and the AI plan are real and work now. Signing in, sending the application, and the status updates are practice screens with made-up data. No government website is contacted.</p>
    </div>
    <button class="btn" id="again">Start again →</button>`);
  q('#again').onclick = reset;
}

function help() {
  app.innerHTML = layout(`
    <div class="eyebrow">About Setu</div>
    <h2>What Setu does</h2>
    <div class="card">
      <div class="feature"><i>?</i><span><b>It makes a plan</b><br>Tell Setu what you need. It gives you the steps, the documents, where to go, and how to fix problems.</span></div>
      <div class="feature"><i>?</i><span><b>It does not decide anything</b><br>Setu never approves or rejects anything. It never asks for your Aadhaar, OTP or password.</span></div>
      <div class="feature"><i>?</i><span><b>It can help in person</b><br>For real, a help centre (CSC) could do the steps with you.</span></div>
    </div>
    <p class="sub">An independent demo made for the Build What Moves India hackathon. Made-up data, practice screens, AI-written guidance.</p>
    ${nav('help')}`);
  bindNav();
}

home();
