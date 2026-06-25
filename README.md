<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f8362a0e-2ad4-4293-b00e-e6b8b19e1ba3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app (in two terminals):
   `npm run dev` and `npm run dev:server`

## Deploy (free)

This repo includes a `render.yaml` for one-click deployment to [Render](https://render.com) free tier:

1. Push this repo to GitHub.
2. On Render, "New +" → "Blueprint", point it at the repo. It reads `render.yaml` automatically.
3. Set the `VITE_HOLODEX_API_KEY` env var when prompted.
4. Render runs `npm install && npm run build` (builds the frontend and bundles `server/chatServer.ts` into `server.js`) then `npm run start` (serves the built frontend and the live-chat WebSocket from one process on Render's assigned `$PORT`).

The free plan spins the service down when idle and wakes it on the next request (a few seconds of cold start).
