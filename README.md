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
