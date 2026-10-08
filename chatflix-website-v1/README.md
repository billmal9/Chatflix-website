# Chatflix Website V1

Vercel-ready Next.js public website.

## Run
npm install
npm run dev

## Deploy
Put the project in GitHub, import it into Vercel, set `NEXT_PUBLIC_SITE_URL` to the final domain, deploy, then connect the custom domain.

Before production, replace the support placeholder in `lib/site.ts` and finalize the legal pages.

Never place Supabase service-role keys, M-Pesa secrets, dLocal secrets, Stripe secret keys, or other provider secrets in this repository.
