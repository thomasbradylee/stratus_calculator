# Stratus Proxy Server

A lightweight Node.js proxy that sits between the Stratus calculator and the Anthropic API, keeping your API key off the client.

---

## Local setup (development)

1. **Install dependencies**
   ```
   npm install
   ```

2. **Add your API key**
   ```
   cp .env.example .env
   ```
   Open `.env` and replace `sk-ant-your-key-here` with your real Anthropic API key.

3. **Start the server**
   ```
   npm start
   ```
   The proxy runs at `http://localhost:3000`.

4. **Open the calculator**
   Open `stratus_calculator.html` in your browser. The `PROXY_URL` at the top of its script block is already set to `http://localhost:3000` — no changes needed for local use.

---

## Deploying to the internet (so the calculator works from Google Drive)

Since Google Drive serves the HTML from `*.googleusercontent.com`, the calculator needs a publicly accessible proxy URL. The easiest free options:

### Option A — Railway (recommended, ~2 min setup)
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo** (push this folder to a repo first), or use **Deploy from template → Node**
3. In the Railway dashboard, go to **Variables** and add:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
4. Railway gives you a public URL like `https://stratus-proxy-production.up.railway.app`
5. Open `stratus_calculator.html`, find this line near the top of the `<script>` block:
   ```js
   const PROXY_URL = 'http://localhost:3000';
   ```
   Change it to your Railway URL:
   ```js
   const PROXY_URL = 'https://stratus-proxy-production.up.railway.app';
   ```
6. Re-upload the updated HTML to Google Drive.

### Option B — Render
1. Go to [render.com](https://render.com), create a **Web Service** from your repo
2. Set **Start Command** to `npm start`
3. Add environment variable `ANTHROPIC_API_KEY`
4. Use the provided `.onrender.com` URL as your `PROXY_URL`

### Option C — Fly.io
```
fly launch
fly secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
fly deploy
```

---

## Files

| File | Purpose |
|---|---|
| `server.js` | The proxy server |
| `.env.example` | Template for your environment variables |
| `.env` | Your actual keys — never commit this |
| `.gitignore` | Keeps `.env` and `node_modules` out of git |

---

## API surface

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/api/generate` | POST | Proxies request to Anthropic `/v1/messages` |
