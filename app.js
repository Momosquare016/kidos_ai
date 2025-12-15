// KIDOS AI Website JavaScript

// Global variables
let currentAgeGroup = 'middle'; // Default age group
let parentMode = false;
let chatHistory = [];
let conversationHistory = []; // For Gemini context

// Gemini API Configuration
let GEMINI_API_KEY = localStorage.getItem('geminiApiKey') || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Content filtering - words and topics to block
const BLOCKED_WORDS = [
    // Profanity
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'cunt', 'dick', 'cock', 'pussy',
    'bastard', 'whore', 'slut', 'piss', 'crap', 'hell', 'bloody', 'asshole',

    // Sexual content
    'sex', 'sexual', 'porn', 'pornography', 'naked', 'nude', 'xxx', 'erotic', 'orgasm',
    'intercourse', 'condom', 'viagra', 'penis', 'vagina', 'genital', 'genitals',
    'breasts', 'boobs', 'nipple', 'masturbat', 'horny', 'sexy', 'seduce',
    'prostitut', 'escort', 'hooker', 'stripper', 'onlyfans', 'nsfw',

    // Reproduction topics
    'reproduction', 'reproductive', 'fertilization', 'sperm', 'ovum',
    'conception', 'pregnan', 'birth control', 'contraceptive',
    'menstruation', 'puberty', 'ovulation', 'testicle', 'uterus', 'womb',

    // LGBTQ topics
    'lgbtq', 'lgbt', 'lesbian', 'gay', 'bisexual', 'transgender', 'queer',
    'homosexual', 'heterosexual', 'pansexual', 'asexual', 'nonbinary', 'non-binary',
    'cisgender', 'gender identity', 'sexual orientation', 'coming out', 'pride parade',
    'same-sex', 'drag queen', 'drag king', 'transitioning', 'hormone therapy',
    'pride month', 'lgbtqia', 'two moms', 'two dads', 'gay marriage',

    // Violence and self-harm
    'kill', 'murder', 'suicide', 'suicidal', 'blood', 'gore', 'violent',
    'self-harm', 'selfharm', 'cutting', 'cut myself', 'hurt myself', 'harm myself',
    'end my life', 'want to die', 'kill myself', 'hang myself', 'overdose',
    'abuse', 'abused', 'rape', 'assault', 'torture', 'stab', 'shoot',

    // Drugs and substances
    'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'cannabis',
    'alcohol', 'beer', 'wine', 'vodka', 'whiskey', 'drunk', 'cigarette', 'vape',
    'smoking', 'nicotine', 'addiction', 'addicted', 'lsd', 'ecstasy',
    'ketamine', 'opioid', 'fentanyl'
];

const BLOCKED_TOPICS = [
    // Violence
    'how to make a bomb', 'how to kill', 'how to hurt', 'how to steal',
    'illegal', 'weapon', 'gun', 'violence', 'gambling', 'betting',
    'how to fight', 'how to punch', 'how to attack',

    // Adult/Sexual topics
    'how babies are made', 'where babies come from', 'birds and bees',
    'what is sex', 'explain sex', 'tell me about sex', 'having sex',
    'make love', 'making love', 'sleep together', 'sleeping together',

    // LGBTQ topics
    'what is gay', 'what is lesbian', 'what is transgender', 'what is lgbtq',
    'what does gay mean', 'what does lesbian mean', 'what is bisexual',
    'why are people gay', 'two men kiss', 'two women kiss', 'same sex',
    'boy likes boy', 'girl likes girl', 'gender identity', 'sexual orientation',
    'what is pride', 'pride month', 'rainbow flag meaning',

    // Self-harm related
    'how to hurt myself', 'how to kill myself', 'ways to die',
    'i want to die', 'i hate myself', 'nobody loves me', 'end it all',
    'not worth living', 'better off dead',

    // Reproduction
    'how reproduction works', 'human reproduction', 'sexual reproduction',
    'how to get pregnant', 'making a baby', 'where do babies come from',
    'how is baby made', 'how are babies born', 'mating'
];

// Restricted response message
const RESTRICTED_RESPONSE = "These are concepts that are a bit too complex for me to explain. Let's talk about something fun instead! Would you like to learn about animals, space, science, or history?";

// Check if message contains inappropriate content
function containsInappropriateContent(text) {
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

// Get age-appropriate system prompt
function getSystemPrompt() {
    const ageDescriptions = {
        'little': '3-7 years old. Use very simple words, short sentences, and be extra friendly and encouraging. Use analogies they understand (like toys, cartoons, family).',
        'middle': '8-12 years old. Use clear explanations with some educational vocabulary. Be engaging and curious. Can handle more complex topics explained simply.',
        'big': '13-18 years old. Use more sophisticated language and can discuss deeper topics. Still be respectful and educational.'
    };

    return `You are KIDOS AI, a friendly, safe, and educational AI assistant for children aged ${ageDescriptions[currentAgeGroup]}

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

Be conversational and engaging - not robotic. Use the child's name if they share it. Ask follow-up questions to keep them engaged. Make learning fun! Format your responses with good spacing and line breaks for readability.`;
}

// Local fallback data for when server is not running
const LOCAL_TOPICS = {
    'little': [
        {name: 'Animals', icon: 'fa-paw', description: 'Learn about different animals and their habitats'},
        {name: 'Colors & Shapes', icon: 'fa-palette', description: 'Discover colors, shapes, and patterns'},
        {name: 'Nature', icon: 'fa-leaf', description: 'Explore plants, weather, and the natural world'},
        {name: 'Space', icon: 'fa-rocket', description: 'Learn about planets, stars, and space exploration'},
        {name: 'Dinosaurs', icon: 'fa-dragon', description: 'Discover amazing facts about dinosaurs'}
    ],
    'middle': [
        {name: 'Science', icon: 'fa-flask', description: 'Explore biology, chemistry, physics, and earth science'},
        {name: 'History', icon: 'fa-landmark', description: 'Learn about important events and people from the past'},
        {name: 'Geography', icon: 'fa-globe-americas', description: 'Discover countries, cultures, and landforms'},
        {name: 'Math', icon: 'fa-calculator', description: 'Practice math skills and solve fun problems'},
        {name: 'Technology', icon: 'fa-laptop-code', description: 'Learn about computers, coding, and digital skills'}
    ],
    'big': [
        {name: 'Computer Science', icon: 'fa-code', description: 'Learn programming, algorithms, and computer systems'},
        {name: 'Engineering', icon: 'fa-cogs', description: 'Explore how things are designed and built'},
        {name: 'Arts & Literature', icon: 'fa-book', description: 'Discover great books, art, music, and creative expression'},
        {name: 'Social Sciences', icon: 'fa-users', description: 'Learn about psychology, sociology, and human behavior'},
        {name: 'Environmental Science', icon: 'fa-seedling', description: 'Explore ecology, conservation, and sustainability'}
    ]
};

const LOCAL_GAMES = {
    'little': [
        {name: 'Animal Sounds', icon: 'fa-volume-up', description: 'Match animals to their sounds'},
        {name: 'Color Match', icon: 'fa-paint-brush', description: 'Find and match colors in pictures'},
        {name: 'Counting Fun', icon: 'fa-sort-numeric-up', description: 'Practice counting with fun animations'},
        {name: 'Shape Sorter', icon: 'fa-shapes', description: 'Sort shapes by color and type'},
        {name: 'Memory Cards', icon: 'fa-clone', description: 'Find matching pairs of cards'}
    ],
    'middle': [
        {name: 'Word Scramble', icon: 'fa-random', description: 'Unscramble letters to make words'},
        {name: 'Math Challenge', icon: 'fa-equals', description: 'Solve math problems against the clock'},
        {name: 'Geography Quiz', icon: 'fa-map-marked-alt', description: 'Identify countries and capitals'},
        {name: 'Science Explorer', icon: 'fa-microscope', description: 'Virtual experiments and discoveries'},
        {name: 'History Timeline', icon: 'fa-history', description: 'Put historical events in order'}
    ],
    'big': [
        {name: 'Code Puzzles', icon: 'fa-puzzle-piece', description: 'Solve coding challenges and puzzles'},
        {name: 'Logic Games', icon: 'fa-brain', description: 'Test your logical thinking skills'},
        {name: 'Debate Simulator', icon: 'fa-comments', description: 'Practice making arguments on various topics'},
        {name: 'Science Lab', icon: 'fa-atom', description: 'Conduct virtual experiments'},
        {name: 'Creative Writing', icon: 'fa-pen-fancy', description: 'Write stories with AI assistance'}
    ]
};

// Local chat responses for offline mode
const LOCAL_RESPONSES = {
    greetings: [
        "Hello there! I'm KIDOS AI, your friendly learning companion! What would you like to explore today?",
        "Hi friend! Ready to learn something amazing? Ask me about animals, space, science, or anything else!",
        "Hey there! So glad you're here! I know lots of cool facts. What do you want to learn about?"
    ],
    animals: [
        "Animals are incredible! Did you know that octopuses have three hearts and blue blood? Dolphins sleep with one eye open, and a group of flamingos is called a 'flamboyance'!",
        "The animal kingdom is fascinating! A hummingbird's heart beats over 1,200 times per minute, and elephants are the only animals that can't jump. What's your favorite animal?",
        "Here's a cool fact: Sloths are such good swimmers that they can hold their breath for up to 40 minutes! And did you know that crows can recognize human faces?"
    ],
    space: [
        "Space is amazing! Our Sun is so big that about 1.3 million Earths could fit inside it. And light from the Sun takes about 8 minutes to reach us!",
        "Did you know there are more stars in the universe than grains of sand on all of Earth's beaches? And a day on Venus is longer than a year on Venus!",
        "Here's a space fact: Astronauts grow about 2 inches taller in space because there's no gravity pushing down on their spine! Would you like to be an astronaut?"
    ],
    dinosaurs: [
        "Dinosaurs ruled Earth for over 165 million years! The T-Rex had the strongest bite of any land animal ever - about 12,800 pounds of force!",
        "Some dinosaurs were as small as chickens! The smallest known dinosaur is the Microraptor, which was about the size of a pigeon. Others like Argentinosaurus were as long as 3 school buses!",
        "Did you know many dinosaurs had feathers? Scientists believe birds are actually living dinosaurs! So every time you see a bird, you're looking at a dinosaur's cousin!"
    ],
    science: [
        "Science helps us understand everything around us! Did you know that lightning is about 5 times hotter than the surface of the Sun? And honey never spoils - archaeologists found 3,000-year-old honey in Egyptian tombs that was still good to eat!",
        "Here's a cool science fact: Your body has about 37.2 trillion cells, and your brain has about 86 billion neurons that help you think, learn, and remember things!",
        "Water is the only substance on Earth that naturally exists in three states: solid (ice), liquid (water), and gas (steam). And hot water freezes faster than cold water - scientists call this the Mpemba effect!"
    ],
    default: [
        "That's a great question! I love helping kids learn. Would you like to know about animals, space, dinosaurs, or science?",
        "I'm here to help you learn! You can ask me about all kinds of interesting topics. What sounds fun to explore?",
        "Learning is an adventure! I can tell you about animals, space, history, science, and lots more. What catches your interest?"
    ]
};

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI
    setupEventListeners();
    setupSettingsModal();
    showSection('chat');
    loadTopics();
    loadGames();

    // Show welcome message based on API key status
    setTimeout(() => {
        if (GEMINI_API_KEY) {
            addMessageToChat("Hello! I'm KIDOS AI, your friendly learning companion! What would you like to learn about today? You can ask me about animals, space, dinosaurs, science, and more!", 'ai');
        } else {
            addMessageToChat("Welcome to KIDOS AI! To start chatting with me, please click the 'Settings' button at the top and add your free Gemini API key. It only takes a minute to set up!", 'ai');
        }
    }, 500);
});

// Setup settings modal
function setupSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('settings-btn');
    const closeBtn = document.getElementById('modal-close');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveBtn = document.getElementById('save-api-key');
    const toggleBtn = document.getElementById('toggle-key-visibility');
    const apiStatus = document.getElementById('api-status');
    const clearChatBtn = document.getElementById('clear-chat');
    const resetProgressBtn = document.getElementById('reset-progress');

    // Load existing API key
    if (GEMINI_API_KEY) {
        apiKeyInput.value = GEMINI_API_KEY;
    }

    // Open modal
    settingsBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Toggle API key visibility
    toggleBtn.addEventListener('click', () => {
        const type = apiKeyInput.type === 'password' ? 'text' : 'password';
        apiKeyInput.type = type;
        toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Save API key
    saveBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();

        if (!key) {
            apiStatus.textContent = 'Please enter an API key';
            apiStatus.className = 'api-status error';
            return;
        }

        apiStatus.textContent = 'Testing API key...';
        apiStatus.className = 'api-status';

        // Test the API key
        try {
            const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Say "API key works!" in exactly those words.' }] }]
                })
            });

            if (testResponse.ok) {
                GEMINI_API_KEY = key;
                localStorage.setItem('geminiApiKey', key);
                apiStatus.textContent = 'API key saved successfully! You can now chat with KIDOS AI.';
                apiStatus.className = 'api-status success';

                // Update welcome message
                setTimeout(() => {
                    modal.classList.remove('active');
                }, 1500);
            } else {
                const error = await testResponse.json();
                apiStatus.textContent = 'Invalid API key. Please check and try again.';
                apiStatus.className = 'api-status error';
            }
        } catch (error) {
            apiStatus.textContent = 'Error testing API key. Please try again.';
            apiStatus.className = 'api-status error';
        }
    });

    // Clear chat
    clearChatBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all chat messages?')) {
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = '';
            chatHistory = [];
            conversationHistory = [];
            addMessageToChat("Chat cleared! What would you like to talk about?", 'ai');
        }
    });

    // Reset progress
    resetProgressBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress and badges?')) {
            localStorage.removeItem('kidosStats');
            stats = {
                questionsAsked: 0,
                topicsExplored: new Set(),
                topicCounts: { animals: 0, space: 0, science: 0, dinosaurs: 0, math: 0 },
                streak: 1,
                lastVisit: new Date().toDateString()
            };
            updateProgressBars();
            updateTopicChart();

            // Reset badges
            document.querySelectorAll('.badge').forEach(badge => {
                badge.classList.remove('unlocked');
                badge.classList.add('locked');
            });

            alert('Progress has been reset!');
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Age group buttons
    document.querySelectorAll('.age-button').forEach(button => {
        button.addEventListener('click', function() {
            setAgeGroup(this.textContent.toLowerCase().includes('little') ? 'little' : 
                        this.textContent.toLowerCase().includes('middle') ? 'middle' : 'big');
            
            document.querySelectorAll('.age-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Reload topics and games for the new age group
            loadTopics();
            loadGames();
        });
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.textContent.toLowerCase();
            showSection(section);
            
            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Parent mode toggle
    document.querySelector('.parent-mode-button').addEventListener('click', function() {
        parentMode = !parentMode;
        this.textContent = parentMode ? 'Exit Parent Mode' : 'Parent Mode';
        
        if (parentMode) {
            alert('Parent Mode activated. Content filtering is less restrictive for educational purposes.');
        } else {
            alert('Parent Mode deactivated. Full content filtering is now active.');
        }
    });
    
    // Chat input and send button
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendButton.addEventListener('click', sendMessage);
}

// Set the current age group
function setAgeGroup(ageGroup) {
    currentAgeGroup = ageGroup;
    console.log(`Age group set to: ${ageGroup}`);
}

// Show the selected section and hide others
function showSection(sectionName) {
    const sections = ['chat', 'learn', 'games'];
    
    sections.forEach(section => {
        const element = document.getElementById(`${section}-section`);
        if (element) {
            if (section === sectionName) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    });
}

// Load topics based on current age group
function loadTopics() {
    // Use local data directly for reliability
    renderTopics(LOCAL_TOPICS[currentAgeGroup] || LOCAL_TOPICS['middle']);

    // Also try to fetch from server if available
    fetch(`/api/topics?age_group=${currentAgeGroup}`)
        .then(response => response.json())
        .then(data => {
            if (data.topics && data.topics.length > 0) {
                renderTopics(data.topics);
            }
        })
        .catch(error => {
            console.log('Using local topics data');
        });
}

function renderTopics(topics) {
    const topicsContainer = document.querySelector('.topics-container');
    if (!topicsContainer) return;

    topicsContainer.innerHTML = '';

    topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        topicCard.innerHTML = `
            <div class="topic-icon"><i class="fas ${topic.icon}"></i></div>
            <h3 class="topic-title">${topic.name}</h3>
            <p class="topic-description">${topic.description}</p>
        `;

        topicCard.addEventListener('click', function() {
            showSection('chat');
            document.querySelector('.nav-button').classList.remove('active');
            document.getElementById('chat-nav').classList.add('active');
            document.querySelector('.message-input').value = `Tell me about ${topic.name.toLowerCase()}`;
            sendMessage();
        });

        topicsContainer.appendChild(topicCard);
    });
}

// Load games based on current age group
function loadGames() {
    // Use local data directly for reliability
    renderGames(LOCAL_GAMES[currentAgeGroup] || LOCAL_GAMES['middle']);

    // Also try to fetch from server if available
    fetch(`/api/games?age_group=${currentAgeGroup}`)
        .then(response => response.json())
        .then(data => {
            if (data.games && data.games.length > 0) {
                renderGames(data.games);
            }
        })
        .catch(error => {
            console.log('Using local games data');
        });
}

function renderGames(games) {
    const gamesContainer = document.querySelector('.games-container');
    if (!gamesContainer) return;

    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-icon"><i class="fas ${game.icon}"></i></div>
            <h3 class="game-title">${game.name}</h3>
            <p class="game-description">${game.description}</p>
        `;

        gameCard.addEventListener('click', function() {
            alert(`${game.name} game would launch here. This is a placeholder for the actual game implementation.`);
        });

        gamesContainer.appendChild(gameCard);
    });
}

// Generate local AI response (fallback when no API key)
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

// Call Gemini API
async function callGeminiAPI(message) {
    // Build conversation context
    const contents = [];

    // Add system prompt as first user message (Gemini doesn't have system role)
    contents.push({
        role: 'user',
        parts: [{ text: getSystemPrompt() + '\n\nPlease acknowledge these rules and say you understand.' }]
    });
    contents.push({
        role: 'model',
        parts: [{ text: 'I understand! I\'m KIDOS AI, a friendly and safe assistant for kids. I\'ll keep everything fun, educational, and age-appropriate. I\'m excited to help with learning about science, animals, space, and lots more! What would you like to explore today?' }]
    });

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
        contents.push({
            role: msg.role,
            parts: [{ text: msg.text }]
        });
    }

    // Add current message
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    }

    throw new Error('No response from AI');
}

// Send a message to the AI
async function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const message = messageInput.value.trim();

    if (message === '') return;

    // Check for inappropriate content in user message
    if (containsInappropriateContent(message)) {
        addMessageToChat(message, 'user');
        messageInput.value = '';
        setTimeout(() => {
            addMessageToChat(RESTRICTED_RESPONSE, 'ai');
        }, 500);
        return;
    }

    // Add user message to chat
    addMessageToChat(message, 'user');
    messageInput.value = '';

    // Show typing indicator
    const chatMessages = document.querySelector('.chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing-indicator';
    typingIndicator.innerHTML = '<div class="loading"><div></div><div></div><div></div></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Check if API key is set
    if (!GEMINI_API_KEY) {
        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            addMessageToChat("Please set up your Gemini API key first! Click the 'Settings' button at the top to add your free API key from Google AI Studio.", 'ai');
        }, 500);
        return;
    }

    try {
        // Call Gemini API
        const aiResponse = await callGeminiAPI(message);

        // Remove typing indicator
        if (typingIndicator.parentNode) {
            chatMessages.removeChild(typingIndicator);
        }

        // Double-check AI response for inappropriate content
        if (containsInappropriateContent(aiResponse)) {
            addMessageToChat("I have a great answer, but let me rephrase it in a more kid-friendly way! What specifically would you like to know about this topic?", 'ai');
        } else {
            // Add to conversation history
            conversationHistory.push({ role: 'user', text: message });
            conversationHistory.push({ role: 'model', text: aiResponse });

            // Add AI response to chat
            addMessageToChat(aiResponse, 'ai');
        }
    } catch (error) {
        console.error('Gemini API error:', error);

        // Remove typing indicator
        if (typingIndicator.parentNode) {
            chatMessages.removeChild(typingIndicator);
        }

        // Check if it's an API key error
        if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403')) {
            addMessageToChat("There's an issue with the API key. Please check your settings and make sure you've entered a valid Gemini API key!", 'ai');
        } else {
            // Fallback to local response
            addMessageToChat(generateLocalResponse(message), 'ai');
        }
    }
}

// Add a message to the chat display
function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');

    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to chat history
    chatHistory.push({
        sender: sender,
        message: message,
        timestamp: new Date().toISOString()
    });

}
