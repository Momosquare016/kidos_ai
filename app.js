// KIDOS AI - Simple Chatbot

// Global variables
let chatHistory = [];

// Content filtering - words and topics to block
const BLOCKED_WORDS = [
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'cunt', 'dick', 'cock', 'pussy',
    'bastard', 'whore', 'slut', 'piss', 'crap', 'hell', 'bloody', 'asshole',
    'sex', 'sexual', 'porn', 'pornography', 'naked', 'nude', 'xxx', 'erotic', 'orgasm',
    'intercourse', 'condom', 'viagra', 'penis', 'vagina', 'genital', 'genitals',
    'breasts', 'boobs', 'nipple', 'masturbat', 'horny', 'sexy', 'seduce',
    'prostitut', 'escort', 'hooker', 'stripper', 'onlyfans', 'nsfw',
    'reproduction', 'reproductive', 'fertilization', 'sperm', 'ovum',
    'conception', 'pregnan', 'birth control', 'contraceptive',
    'menstruation', 'puberty', 'ovulation', 'testicle', 'uterus', 'womb',
    'lgbtq', 'lgbt', 'lesbian', 'gay', 'bisexual', 'transgender', 'queer',
    'homosexual', 'heterosexual', 'pansexual', 'asexual', 'nonbinary', 'non-binary',
    'cisgender', 'gender identity', 'sexual orientation', 'coming out', 'pride parade',
    'same-sex', 'drag queen', 'drag king', 'transitioning', 'hormone therapy',
    'pride month', 'lgbtqia', 'two moms', 'two dads', 'gay marriage',
    'kill', 'murder', 'suicide', 'suicidal', 'blood', 'gore', 'violent',
    'self-harm', 'selfharm', 'cutting', 'cut myself', 'hurt myself', 'harm myself',
    'end my life', 'want to die', 'kill myself', 'hang myself', 'overdose',
    'abuse', 'abused', 'rape', 'assault', 'torture', 'stab', 'shoot',
    'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'cannabis',
    'alcohol', 'beer', 'wine', 'vodka', 'whiskey', 'drunk', 'cigarette', 'vape',
    'smoking', 'nicotine', 'addiction', 'addicted', 'lsd', 'ecstasy',
    'ketamine', 'opioid', 'fentanyl'
];

const BLOCKED_TOPICS = [
    'how to make a bomb', 'how to kill', 'how to hurt', 'how to steal',
    'illegal', 'weapon', 'gun', 'violence', 'gambling', 'betting',
    'how to fight', 'how to punch', 'how to attack',
    'how babies are made', 'where babies come from', 'birds and bees',
    'what is sex', 'explain sex', 'tell me about sex', 'having sex',
    'make love', 'making love', 'sleep together', 'sleeping together',
    'what is gay', 'what is lesbian', 'what is transgender', 'what is lgbtq',
    'what does gay mean', 'what does lesbian mean', 'what is bisexual',
    'why are people gay', 'two men kiss', 'two women kiss', 'same sex',
    'boy likes boy', 'girl likes girl', 'gender identity', 'sexual orientation',
    'what is pride', 'pride month', 'rainbow flag meaning',
    'how to hurt myself', 'how to kill myself', 'ways to die',
    'i want to die', 'i hate myself', 'nobody loves me', 'end it all',
    'not worth living', 'better off dead',
    'how reproduction works', 'human reproduction', 'sexual reproduction',
    'how to get pregnant', 'making a baby', 'where do babies come from',
    'how is baby made', 'how are babies born', 'mating'
];

const RESTRICTED_RESPONSE = "These are concepts that are a bit too complex for me to explain. Let's talk about something fun instead! Would you like to learn about animals, space, science, or history?";

// Local fallback responses
const LOCAL_RESPONSES = {
    greetings: [
        "Hello there! I'm KIDOS AI, your friendly learning companion! What would you like to explore today?",
        "Hi friend! Ready to learn something amazing? Ask me about animals, space, science, or anything else!",
        "Hey there! So glad you're here! I know lots of cool facts. What do you want to learn about?"
    ],
    animals: [
        "Animals are incredible! Did you know that octopuses have three hearts and blue blood? Dolphins sleep with one eye open, and a group of flamingos is called a 'flamboyance'!",
        "The animal kingdom is fascinating! A hummingbird's heart beats over 1,200 times per minute, and elephants are the only animals that can't jump. What's your favorite animal?"
    ],
    space: [
        "Space is amazing! Our Sun is so big that about 1.3 million Earths could fit inside it. And light from the Sun takes about 8 minutes to reach us!",
        "Did you know there are more stars in the universe than grains of sand on all of Earth's beaches? And a day on Venus is longer than a year on Venus!"
    ],
    dinosaurs: [
        "Dinosaurs ruled Earth for over 165 million years! The T-Rex had the strongest bite of any land animal ever - about 12,800 pounds of force!",
        "Did you know many dinosaurs had feathers? Scientists believe birds are actually living dinosaurs! So every time you see a bird, you're looking at a dinosaur's cousin!"
    ],
    science: [
        "Science helps us understand everything around us! Did you know that lightning is about 5 times hotter than the surface of the Sun?",
        "Here's a cool science fact: Your body has about 37.2 trillion cells, and your brain has about 86 billion neurons!"
    ],
    default: [
        "That's a great question! I love helping kids learn. Would you like to know about animals, space, dinosaurs, or science?",
        "I'm here to help you learn! You can ask me about all kinds of interesting topics. What sounds fun to explore?"
    ]
};

// Check if message contains inappropriate content
function containsInappropriateContent(text) {
    const lowerText = text.toLowerCase();
    for (const word of BLOCKED_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(lowerText)) return true;
    }
    for (const topic of BLOCKED_TOPICS) {
        if (lowerText.includes(topic)) return true;
    }
    return false;
}

// Generate local AI response (fallback)
function generateLocalResponse(message) {
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

// Add a message to the chat display
function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatHistory.push({ sender, message, timestamp: new Date().toISOString() });
}

// Send a message to the AI
async function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const message = messageInput.value.trim();

    if (message === '') return;

    // Check for inappropriate content
    if (containsInappropriateContent(message)) {
        addMessageToChat(message, 'user');
        messageInput.value = '';
        setTimeout(() => addMessageToChat(RESTRICTED_RESPONSE, 'ai'), 500);
        return;
    }

    addMessageToChat(message, 'user');
    messageInput.value = '';

    // Show typing indicator
    const chatMessages = document.querySelector('.chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing-indicator';
    typingIndicator.innerHTML = '<div class="loading"><div></div><div></div><div></div></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, age_group: 'middle', parent_mode: false })
        });

        const data = await response.json();

        if (typingIndicator.parentNode) {
            chatMessages.removeChild(typingIndicator);
        }

        if (data.response) {
            if (containsInappropriateContent(data.response)) {
                addMessageToChat("I have a great answer, but let me rephrase it in a more kid-friendly way! What specifically would you like to know about this topic?", 'ai');
            } else {
                addMessageToChat(data.response, 'ai');
            }
        } else {
            addMessageToChat(generateLocalResponse(message), 'ai');
        }
    } catch (error) {
        console.error('API error:', error);
        if (typingIndicator.parentNode) {
            chatMessages.removeChild(typingIndicator);
        }
        addMessageToChat(generateLocalResponse(message), 'ai');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    sendButton.addEventListener('click', sendMessage);

    // Welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm KIDOS AI, your friendly learning companion! What would you like to learn about today? You can ask me about animals, space, dinosaurs, science, and more!", 'ai');
    }, 500);
});
