export async function callChatAPI(message, conversationHistory) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory: conversationHistory.slice(-10)
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error('Rate limited - please wait a moment and try again.');
    }
    if (error.error === 'API key not configured on server') {
      throw new Error('API key not configured');
    }
    throw new Error(error.error || `API request failed (${response.status})`);
  }

  const data = await response.json();
  return data.response;
}
