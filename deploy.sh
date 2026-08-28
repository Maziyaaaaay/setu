#!/usr/bin/env bash
# One-shot deploy for Setu. Run from this folder AFTER `npx netlify-cli login`.
set -euo pipefail
cd "$(dirname "$0")"

echo "→ checking Netlify auth"
npx --yes netlify-cli status >/dev/null 2>&1 || {
  echo "Not logged in. Run:  npx netlify-cli login   then re-run this script."
  exit 1
}

echo "→ linking site (uses .netlify/state.json)"
npx --yes netlify-cli link >/dev/null 2>&1 || true

if [ "${OPENAI_API_KEY:-}" != "" ]; then
  echo "→ setting OPENAI_API_KEY on Netlify from your shell env"
  npx --yes netlify-cli env:set OPENAI_API_KEY "$OPENAI_API_KEY" >/dev/null
else
  echo "⚠  OPENAI_API_KEY not in your shell env."
  echo "   Either:  export OPENAI_API_KEY=sk-...   and re-run,"
  echo "   or set it in the Netlify dashboard → Site configuration → Environment variables."
fi

echo "→ deploying to production"
npx --yes netlify-cli deploy --prod --dir site --message "Setu: AI planner backend + 16 services + plain-language pass"

echo
echo "✓ done. Open the Website URL above in an incognito window and walk the full flow."
echo "  A green 'made by AI just now' tag on the plan = OpenAI key is working."
echo "  An amber 'backup plan' tag = key missing or billing not active."
