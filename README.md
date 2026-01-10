<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MkNoSGeoFkmGPLqDT7a9GhkdajgZqB21

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env` to your Gemini API key (Get one [here](https://aistudio.google.com/app/apikey))
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the app:
   `npm run dev`

## Deployment

This project is configured for **GitHub Pages**.

1. Go to your GitHub repository > Settings > Secrets and variables > Actions.
2. Add a new repository secret named `GEMINI_API_KEY` with your API key.
3. Push your code to the `main` or `master` branch.
4. The GitHub Action will automatically build and deploy your site.

