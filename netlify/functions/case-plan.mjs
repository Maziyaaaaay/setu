/* Setu — case plan generator.
 *
 * POST /api/case-plan
 * body: { service, category, portal, notes, purpose, timing }
 *
 * Calls an OpenAI model to turn one public-service goal into a structured,
 * plain-language plan for a citizen. Grounded in `notes` (from catalog.js).
 * On any failure it returns { fallback: true } and the frontend renders a
 * bundled generic plan, so the demo never dead-ends.
 */

const MODEL = 'gpt-4o-mini';

const SYSTEM = `You are Setu. You help one Indian citizen get through ONE government task without losing time.

The reader is on a phone and may not have done this online before.

Language rules (important):
- Use short, everyday words. Aim for a 12-year-old reader. Sentences under 15 words.
- No jargon and no formal or bureaucratic words. Say "papers you need" not "requisite documentation", "check" not "verification", "office" not "competent authority". Real names of websites and schemes are fine (EPFO, eDistrict, DigiLocker, PAN, UAN).
- Do not state an exact fee, an exact number of days, a form number, a law section or an office name as a hard fact. Say "usually" or "about", and tell the reader to check the official website named.
- Never ask for a real Aadhaar number, OTP, password, or bank or card detail.

Content rules:
- Fit the plan to the reader's stated reason and their deadline when given.
- Give exactly 4 route stages, in order and with these stage labels: "DO NOW" (channel self), "ONLINE" (channel online), "IF NEEDED" (channel assisted, for in-person help), "TRACK" (channel track).
- Give 3 to 6 documents. For each: a one-line reason it is needed, and the single most common mistake people make with it.
- Give 2 to 4 things that go wrong: short and specific, the kind of thing that costs someone days.
- "recovery": the one thing a citizen is most often asked for AFTER applying, and how to sort it out without applying again.
Return only the structured object.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'timeframe', 'route', 'documents', 'pitfalls', 'recovery'],
  properties: {
    summary: { type: 'string', description: 'One or two sentences: what this journey involves and the main thing that goes wrong.' },
    timeframe: { type: 'string', description: 'Typical time from a complete application to the outcome, phrased with "usually" / "typically".' },
    route: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['stage', 'title', 'detail', 'channel'],
        properties: {
          stage: { type: 'string', description: 'Short label e.g. DO NOW, ONLINE, IF NEEDED, TRACK' },
          title: { type: 'string' },
          detail: { type: 'string' },
          channel: { type: 'string', enum: ['self', 'online', 'assisted', 'track'] }
        }
      }
    },
    documents: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'why', 'commonMistake'],
        properties: {
          name: { type: 'string' },
          why: { type: 'string' },
          commonMistake: { type: 'string' }
        }
      }
    },
    pitfalls: { type: 'array', items: { type: 'string' } },
    recovery: {
      type: 'object',
      additionalProperties: false,
      required: ['item', 'what', 'where', 'after'],
      properties: {
        item: { type: 'string', description: 'The one thing a reviewer commonly asks for.' },
        what: { type: 'string', description: 'What it is and why it is being asked for. Reassure that the application is not cancelled.' },
        where: { type: 'string', description: 'Where or how to provide it.' },
        after: { type: 'string', description: 'What happens once it is provided — no new application needed.' }
      }
    }
  }
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const key = process.env.OPENAI_API_KEY;

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  const { service, category, portal, notes, purpose, timing } = body || {};
  if (!service || !notes) return json({ error: 'missing_service', fallback: true });
  if (!key) return json({ error: 'no_api_key', fallback: true });

  const user = [
    `Service: ${service}`,
    `Category: ${category || 'not specified'}`,
    `Official portal: ${portal || 'not specified'}`,
    `Citizen's purpose: ${purpose || 'not specified'}`,
    `Citizen needs to be ready: ${timing || 'no fixed deadline'}`,
    '',
    'Service notes (rely on these):',
    notes
  ].join('\n');

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: user }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'case_plan', strict: true, schema: SCHEMA }
        }
      }),
      signal: AbortSignal.timeout(22000)
    });

    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return json({ error: 'openai_error', status: r.status, detail, fallback: true });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return json({ error: 'empty_completion', fallback: true });

    const plan = JSON.parse(content);
    return json({ plan, source: 'ai', model: MODEL });
  } catch (e) {
    return json({ error: 'exception', detail: String(e).slice(0, 200), fallback: true });
  }
};
