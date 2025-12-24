import { BLOCKED_WORDS, BLOCKED_TOPICS } from '../data/content';

export function containsInappropriateContent(text) {
  const lowerText = text.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      return true;
    }
  }

  for (const topic of BLOCKED_TOPICS) {
    if (lowerText.includes(topic)) {
      return true;
    }
  }

  return false;
}
