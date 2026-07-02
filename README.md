# KIDOS AI

A kid-safe educational AI chatbot that lets children explore science, animals, space, history, and more in a fun, age-appropriate way.

**Live Demo:** https://kidosai.seeleco.co/

## Overview

KIDOS AI is a React web app that gives children a friendly AI companion to learn with. It is built safety-first: the AI is instructed to stay strictly PG and educational, and every response passes a second AI classifier check before it reaches the child. The AI provider key is kept on the server, never exposed in the browser.

## Features

- AI chat powered by Groq (Llama 3.3 70B), giving fast, friendly, educational answers
- Dual content safety: a strict system prompt plus a separate classifier pass on every response, with a safe fallback message
- Animated AI avatar companion alongside the chat
- Responsive design for desktop, tablet, and mobile
- Clear chat to reset the conversation anytime
- Learn, Games, and Voice Input sections (coming soon)

## Tech Stack

- **Frontend:** React 19, Vite, React-Bootstrap, React-Icons
- **AI:** Groq API running Llama 3.3 70B (`llama-3.3-70b-versatile`)
- **Backend:** Vercel serverless function (`api/chat.js`) that proxies Groq and keeps the API key server-side
- **Animations:** Lottie (lottie-react) plus CSS animations
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18 or newer
- A Groq API key (free at https://console.groq.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Momosquare016/kidos-ai.git
cd kidos-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the API key
The Groq key is used only by the serverless function, so it is stored server-side (no `VITE_` prefix, never bundled into the client). Set the following environment variable (value omitted):

```
GROQ_API_KEY
```

For local development, add it to a `.env` file at the project root. For deployment, add it in your Vercel project's environment variables.

### 4. Run locally
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

> Note: the AI chat calls the `/api/chat` serverless function, which runs on Vercel. Use `vercel dev` if you want the serverless function to run locally alongside the client.

## Architecture

The browser never talks to Groq directly. The client (`src/utils/geminiApi.js`, the legacy filename for the chat client) posts the message to `/api/chat`. That serverless function (`api/chat.js`) injects the safety system prompt, calls Groq with the server-held key, then runs the reply through a second Groq classifier pass. Only responses judged safe are returned; anything flagged is replaced with a safe fallback message.

## Author

Built by Muhammad Ali

LinkedIn: https://www.linkedin.com/in/muhammad-ali-r-35a9762b4
