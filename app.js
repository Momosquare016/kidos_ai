// KIDOS AI Website JavaScript

// Global variables
let currentAgeGroup = 'middle'; // Default age group
let parentMode = false;
let chatHistory = [];

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI
    setupEventListeners();
    showSection('chat');
    loadTopics();
    loadGames();
});

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
    fetch(`/api/topics?age_group=${currentAgeGroup}`)
        .then(response => response.json())
        .then(data => {
            const topicsContainer = document.querySelector('.topics-container');
            if (!topicsContainer) return;
            
            topicsContainer.innerHTML = '';
            
            data.topics.forEach(topic => {
                const topicCard = document.createElement('div');
                topicCard.className = 'topic-card';
                topicCard.innerHTML = `
                    <div class="topic-icon"><i class="fas ${topic.icon}"></i></div>
                    <h3 class="topic-title">${topic.name}</h3>
                    <p class="topic-description">${topic.description}</p>
                `;
                
                topicCard.addEventListener('click', function() {
                    showSection('chat');
                    document.querySelector('.message-input').value = `Tell me about ${topic.name.toLowerCase()}`;
                    sendMessage();
                });
                
                topicsContainer.appendChild(topicCard);
            });
        })
        .catch(error => console.error('Error loading topics:', error));
}

// Load games based on current age group
function loadGames() {
    fetch(`/api/games?age_group=${currentAgeGroup}`)
        .then(response => response.json())
        .then(data => {
            const gamesContainer = document.querySelector('.games-container');
            if (!gamesContainer) return;
            
            gamesContainer.innerHTML = '';
            
            data.games.forEach(game => {
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
        })
        .catch(error => console.error('Error loading games:', error));
}

// Send a message to the AI
function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
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
    
    // Send message to backend
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            age_group: currentAgeGroup,
            parent_mode: parentMode
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Add AI response to chat
        addMessageToChat(data.response, 'ai');
    })
    .catch(error => {
        console.error('Error sending message:', error);
        chatMessages.removeChild(typingIndicator);
        addMessageToChat("Sorry, I couldn't process your message. Please try again.", 'ai');
    });
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
