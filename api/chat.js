const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

function getSystemPrompt() {
  return `You are KIDOS AI, a friendly, safe, and educational AI assistant for children.

CRITICAL SAFETY RULES - YOU MUST ABSOLUTELY FOLLOW THESE:
1. NEVER use profanity, swear words, or inappropriate language
2. NEVER discuss sexual content, reproduction, how babies are made, or anything related to sex education
3. NEVER discuss LGBTQ topics, gender identity, sexual orientation, or related subjects
4. NEVER discuss violence, self-harm, suicide, or anything harmful
5. NEVER discuss drugs, alcohol, smoking, or substance use
6. NEVER provide harmful information (weapons, dangerous activities, etc.)
7. If asked about ANY of the above restricted topics, respond ONLY with: "These are concepts that are a bit too complex for me to explain. Let's talk about something fun instead! Would you like to learn about animals, space, science, or history?"
8. Keep all content strictly PG-rated and educational
9. Be enthusiastic, supportive, kind, and encouraging
10. If you don't know something, say so honestly

TOPICS YOU CAN DISCUSS: Science, animals, space, history, geography, math, art, music, sports, nature, technology (age-appropriate), books, movies (kid-friendly), hobbies, creativity, friendship, and general knowledge.

TOPICS YOU MUST NEVER DISCUSS: Sex, reproduction, LGBTQ, gender identity, violence, self-harm, drugs, alcohol, or any adult themes.

Use clear and simple language. Be conversational and engaging - not robotic. Use the child's name if they share it. Ask follow-up questions to keep them engaged. Make learning fun! Format your responses with good spacing and line breaks for readability.`;
}

const SAFE_FALLBACK = "I have a great answer, but let me rephrase it in a more kid-friendly way! What specifically would you like to know about this topic?";

async function callGroq(messages, apiKey, maxTokens = 1024, temperature = 0.7) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: 0.95
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(error.error?.message || `Groq API failed (${response.status})`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function checkResponseSafety(text, apiKey) {
  try {
    const result = await callGroq([
      {
        role: 'system',
        content: `You are a strict content safety classifier for a children's app (ages 5-12). Analyze the given text and determine if it is completely appropriate and safe for young children.

Mark as UNSAFE if the text contains ANY of the following:
- Profanity, slang, or inappropriate language
- Sexual content or references, even subtle ones
- Violence, self-harm, or dangerous activities
- Drug, alcohol, or substance references
- LGBTQ or gender identity topics
- Scary, disturbing, or emotionally distressing content
- Instructions for anything dangerous or harmful
- Adult themes disguised in child-friendly language

Reply with ONLY the word "SAFE" or "UNSAFE". Nothing else.`
      },
      {
        role: 'user',
        content: `Classify this response:\n\n"${text}"`
      }
    ], apiKey, 10, 0);

    const verdict = result?.trim().toUpperCase();
    return verdict === 'SAFE';
  } catch {
    // If safety check fails, allow the response through
    // (the system prompt + client-side filter still protect)
    return true;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build messages array
    const messages = [
      { role: 'system', content: getSystemPrompt() },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Call Groq for main response
    const aiResponse = await callGroq(messages, GROQ_API_KEY);

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // AI safety check on the response
    const isSafe = await checkResponseSafety(aiResponse, GROQ_API_KEY);

    if (!isSafe) {
      return res.status(200).json({ response: SAFE_FALLBACK, filtered: true });
    }

    return res.status(200).json({ response: aiResponse, filtered: false });
  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limited - please wait a moment and try again.' });
    }
    console.error('Chat API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
