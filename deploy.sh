#!/usr/bin/env bash
# Redeploy Setu to https://setu-india.netlify.app
# Already logged into Netlify as Mazin Kp. The AI planner runs on the Netlify AI
# Gateway, so no OpenAI key needs to be set here.
set -euo pipefail
cd "$(dirname "$0")"

npx --yes netlify-cli deploy --prod --dir site --message "${1:-Setu update}"

echo
echo "→ health check:"
sleep 3
curl -s https://setu-india.netlify.app/api/case-plan; echo
echo "Open https://setu-india.netlify.app in an incognito window and walk the flow."
echo "Plan header should say 'made by AI just now' (green)."
