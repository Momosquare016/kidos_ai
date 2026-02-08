# KIDOS AI

A safe and kid-friendly AI chatbot web application that helps children learn and explore topics like science, animals, space, history, and more — all in a fun, age-appropriate way.

## Features

- **AI Chat** — Powered by Google Gemini, kids can ask questions and get friendly, educational responses
- **Animated AI Avatar** — A cute animated robot companion that sits alongside the chat
- **Content Safety** — Built-in content filtering blocks inappropriate topics and language on both input and output
- **Learn Section** — Educational topic explorer (coming soon)
- **Games Section** — Fun learning games (coming soon)
- **Voice Input** — Microphone transcription support (coming soon)
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Clear Chat** — Reset conversation anytime from Settings

## Tech Stack

- **Frontend:** React 19, Vite 7, React-Bootstrap 2, React-Icons
- **AI:** Google Gemini 2.0 Flash API (client-side)
- **Animations:** Lottie (lottie-react) + CSS animations
- **Styling:** Custom CSS with gradients and animations
- **Deployment:** Vercel (auto-deploys from GitHub)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Momosquare016/kidos_ai.git
   cd kidos_ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   Get a free key from: https://aistudio.google.com/app/apikey

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser.

## Project Structure

```
├── src/
│   ├── components/      # React components (Chat, Avatar, Header, etc.)
│   ├── utils/           # API client, content filter, local responses
│   ├── data/            # Content data (topics, games, blocked words)
│   ├── App.jsx          # Main application component
│   ├── App.css          # All component styles
│   └── index.css        # Global styles
├── index.html           # Vite entry point
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```

## Deployment

The app auto-deploys to Vercel on every push to the `master` branch. Make sure `VITE_GEMINI_API_KEY` is set in your Vercel project's environment variables.

## Contact

- Email: monotify016@gmail.com
- LinkedIn: [Muhammad Ali R](https://www.linkedin.com/in/muhammad-ali-r-35a9762b4/)
