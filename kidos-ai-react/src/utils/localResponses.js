import { LOCAL_RESPONSES } from '../data/content';

export function generateLocalResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/\b(hi|hello|hey|howdy)\b/)) {
    return LOCAL_RESPONSES.greetings[Math.floor(Math.random() * LOCAL_RESPONSES.greetings.length)];
  }
  if (lowerMessage.match(/\b(animal|animals|pet|pets|dog|cat|lion|elephant)\b/)) {
    return LOCAL_RESPONSES.animals[Math.floor(Math.random() * LOCAL_RESPONSES.animals.length)];
  }
  if (lowerMessage.match(/\b(space|planet|star|galaxy|moon|sun|astronaut|rocket)\b/)) {
    return LOCAL_RESPONSES.space[Math.floor(Math.random() * LOCAL_RESPONSES.space.length)];
  }
  if (lowerMessage.match(/\b(dinosaur|dinosaurs|trex|t-rex|raptor|fossil)\b/)) {
    return LOCAL_RESPONSES.dinosaurs[Math.floor(Math.random() * LOCAL_RESPONSES.dinosaurs.length)];
  }
  if (lowerMessage.match(/\b(science|experiment|chemistry|physics|biology|scientist)\b/)) {
    return LOCAL_RESPONSES.science[Math.floor(Math.random() * LOCAL_RESPONSES.science.length)];
  }

  return LOCAL_RESPONSES.default[Math.floor(Math.random() * LOCAL_RESPONSES.default.length)];
}
