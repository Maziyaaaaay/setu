/* Vercel entry point for the case-plan function.
   The logic lives in ../lib/case-plan-core.mjs (shared with the Netlify build). */
export { default } from '../lib/case-plan-core.mjs';

export const config = { runtime: 'edge' };
