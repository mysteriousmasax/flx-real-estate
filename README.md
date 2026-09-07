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

## Automatic deployment

The GitHub Actions workflow in `.github/workflows/firebase-hosting.yml` deploys the `main` branch to Firebase Hosting and creates a temporary preview channel for pull requests.

In the connected GitHub repository, add this required Actions secret:

- `FIREBASE_SERVICE_ACCOUNT_PRAGMATIC_NUCLEUS_1MS1D`: a Firebase service-account JSON key with permission to deploy Hosting.

These optional build secrets enable the corresponding integrations in production:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`

The `cloud-run-deploy.yml` workflow also deploys every push to `main` to the existing Cloud Run service in `europe-west2`. Configure these GitHub Actions secrets for the `run.app` URL:

- `GCP_PROJECT_ID`: the Google Cloud project ID that owns the public Cloud Run service.
- `GCP_SERVICE_ACCOUNT_KEY`: service-account JSON with Cloud Run Admin, Service Account User, and Cloud Build permissions.
- `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_MAPS_API_KEY`: optional build-time integration keys.

The service account must be allowed to deploy the existing service `ais-dev-lhvhtlrgaevi3i4gdaxmvx` in `europe-west2`. If the Cloud Run service has a different name, update `CLOUD_RUN_SERVICE` in the workflow.

## Workspace routes

The application uses role-aware browser routes so each user enters a focused workspace:

- `/marketplace` — client buying and renting marketplace
- `/investor/opportunities` — investor opportunities and yield-focused listings
- `/agent/intake` — field agent property registration
- `/owner/portfolio` — owner property account ledger
- `/admin/dashboard` — listing approval and lead operations
- `/property/:id` — shareable property detail view

## Firebase production setup

The application now reads properties and enquiries from Firestore and uses Firebase Authentication for Google sign-in. Deploy the included rules before enabling real users:

```bash
firebase login
firebase use pragmatic-nucleus-1ms1d
firebase deploy --only firestore:rules,storage
```

In Firebase Console, enable Google under Authentication → Sign-in method. The first signed-in Admin profile must be granted the `Admin` role in the `users/{uid}` Firestore document. No sample properties or sample leads are loaded by the application; an authenticated agent must create the first listing.
