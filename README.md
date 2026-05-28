# Aura — Voice Assistant

A dark, spatial AI voice assistant with an animated SVG avatar. Tap the mic, speak, and let Aura respond.

## Setup

1. Clone the repo
2. Run: `npm install`
3. Get a free Groq API key at [console.groq.com](https://console.groq.com)
4. Create `.env`: `GROQ_API_KEY=your_key_here`
5. Run locally: `npm run dev` (frontend) + `vercel dev` (backend)

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Framework preset: Vite
4. Add environment variable: `GROQ_API_KEY` = your key
5. Deploy

## Browser support

| Browser | Supported |
|---------|-----------|
| Chrome  | Yes       |
| Edge    | Yes       |
| Firefox | No (no Web Speech API) |
| Safari  | No (no Web Speech API) |

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** CSS Modules
- **STT:** Browser Web Speech API
- **AI:** Groq API (llama-3.3-70b-versatile)
- **TTS:** Browser SpeechSynthesis API
- **Avatar:** Animated inline SVG
- **Backend:** Vercel Serverless Function
- **Deployment:** Vercel (free tier)
