<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/40c0fc33-86e9-41a3-94d4-1d20327da997

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Demo role accounts

Start the API with `npm run server`, open the client site, click the profile, and use the professional workspace login panel.

| Role | Email | Password |
| --- | --- | --- |
| Client | `client@flx.local` | `client123` |
| Owner | `owner@flx.local` | `owner123` |
| Agent | `agent@flx.local` | `agent123` |
| Investor | `investor@flx.local` | `investor123` |
| Admin | `admin@flx.local` | `admin123` |

Clients stay in the public landing journey. Owner, Agent, Investor, and Admin accounts open their separate desktop workspaces after database-backed login.

## Deployment

This project is intended to be deployed from Railway. Keep all environment variables in the Railway dashboard instead of storing Google or Firebase credentials in the repository.

## Workspace routes

The application uses role-aware browser routes so each user enters a focused workspace:

- `/marketplace` — client buying and renting marketplace
- `/investor/opportunities` — investor opportunities and yield-focused listings
- `/agent/intake` — field agent property registration
- `/owner/portfolio` — owner property account ledger
- `/admin/dashboard` — listing approval and lead operations
- `/property/:id` — shareable property detail view

## Production data setup

The application uses its own local authentication flow and keeps production data in the configured backend services. No Google or Firebase credentials are required in the deployment settings.
