const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

export async function callGeminiAPI(message, conversationHistory) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('API key not configured');
  }

  const contents = [];

  contents.push({
    role: 'user',
    parts: [{ text: getSystemPrompt() + '\n\nPlease acknowledge these rules and say you understand.' }]
  });
  contents.push({
    role: 'model',
    parts: [{ text: "I understand! I'm KIDOS AI, a friendly and safe assistant for kids. I'll keep everything fun, educational, and age-appropriate. What would you like to explore today?" }]
  });

  const recentHistory = conversationHistory.slice(-10);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.text }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limited - please wait a moment and try again.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed (${response.status})`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('No response from AI');
}
