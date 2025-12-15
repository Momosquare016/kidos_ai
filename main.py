from flask import Flask, request, jsonify, render_template, url_for
import re
import os
import json
import random
import requests

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Import the necessary path configuration
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Configure Flask app - serve files from current directory
app = Flask(__name__,
            static_folder='.',
            static_url_path='')

# Content filtering patterns - improved to catch more variations
INAPPROPRIATE_PATTERNS = [
    r'\b(sex|porn|naked|nude|boob|breast|penis|vagina|dick|cock|pussy|ass|asshole)\b',
    r'\b(fuck|shit|damn|bitch|cunt|whore|slut|bastard|piss)\b',
    r'\b(kill|murder|suicide|die|death|dead|blood|gore|violent)\b',
    r'\b(drug|cocaine|heroin|weed|marijuana|meth|ecstasy|lsd|pills|substance)\b',
    r'\b(alcohol|beer|wine|vodka|whiskey|drunk|drinking|liquor|intoxication)\b',
    r'\b(cigarette|smoking|tobacco|vape|juul|nicotine)\b',
    r'\b(gambling|bet|casino|poker|slot)\b'
]

# Additional filtering for whole phrases
INAPPROPRIATE_TOPICS = [
    'drugs', 'drug use', 'illegal substances', 'recreational drugs',
    'alcohol', 'drinking', 'alcoholic beverages',
    'sex', 'sexual', 'sexuality', 'reproduction',
    'violence', 'violent', 'killing', 'murder',
    'suicide', 'self-harm',
    'gambling', 'betting',
    'smoking', 'tobacco', 'vaping'
]

# Educational topics by age group
EDUCATIONAL_TOPICS = {
    'little': [
        {'name': 'Animals', 'icon': 'fa-paw', 'description': 'Learn about different animals and their habitats'},
        {'name': 'Colors & Shapes', 'icon': 'fa-palette', 'description': 'Discover colors, shapes, and patterns'},
        {'name': 'Nature', 'icon': 'fa-leaf', 'description': 'Explore plants, weather, and the natural world'},
        {'name': 'Space', 'icon': 'fa-rocket', 'description': 'Learn about planets, stars, and space exploration'},
        {'name': 'Dinosaurs', 'icon': 'fa-dragon', 'description': 'Discover amazing facts about dinosaurs'}
    ],
    'middle': [
        {'name': 'Science', 'icon': 'fa-flask', 'description': 'Explore biology, chemistry, physics, and earth science'},
        {'name': 'History', 'icon': 'fa-landmark', 'description': 'Learn about important events and people from the past'},
        {'name': 'Geography', 'icon': 'fa-globe-americas', 'description': 'Discover countries, cultures, and landforms'},
        {'name': 'Math', 'icon': 'fa-calculator', 'description': 'Practice math skills and solve fun problems'},
        {'name': 'Technology', 'icon': 'fa-laptop-code', 'description': 'Learn about computers, coding, and digital skills'}
    ],
    'big': [
        {'name': 'Computer Science', 'icon': 'fa-code', 'description': 'Learn programming, algorithms, and computer systems'},
        {'name': 'Engineering', 'icon': 'fa-cogs', 'description': 'Explore how things are designed and built'},
        {'name': 'Arts & Literature', 'icon': 'fa-book', 'description': 'Discover great books, art, music, and creative expression'},
        {'name': 'Social Sciences', 'icon': 'fa-users', 'description': 'Learn about psychology, sociology, and human behavior'},
        {'name': 'Environmental Science', 'icon': 'fa-seedling', 'description': 'Explore ecology, conservation, and sustainability'}
    ]
}

# Educational games by age group
EDUCATIONAL_GAMES = {
    'little': [
        {'name': 'Animal Sounds', 'icon': 'fa-volume-up', 'description': 'Match animals to their sounds'},
        {'name': 'Color Match', 'icon': 'fa-paint-brush', 'description': 'Find and match colors in pictures'},
        {'name': 'Counting Fun', 'icon': 'fa-sort-numeric-up', 'description': 'Practice counting with fun animations'},
        {'name': 'Shape Sorter', 'icon': 'fa-shapes', 'description': 'Sort shapes by color and type'},
        {'name': 'Memory Cards', 'icon': 'fa-clone', 'description': 'Find matching pairs of cards'}
    ],
    'middle': [
        {'name': 'Word Scramble', 'icon': 'fa-random', 'description': 'Unscramble letters to make words'},
        {'name': 'Math Challenge', 'icon': 'fa-equals', 'description': 'Solve math problems against the clock'},
        {'name': 'Geography Quiz', 'icon': 'fa-map-marked-alt', 'description': 'Identify countries and capitals'},
        {'name': 'Science Explorer', 'icon': 'fa-microscope', 'description': 'Virtual experiments and discoveries'},
        {'name': 'History Timeline', 'icon': 'fa-history', 'description': 'Put historical events in order'}
    ],
    'big': [
        {'name': 'Code Puzzles', 'icon': 'fa-puzzle-piece', 'description': 'Solve coding challenges and puzzles'},
        {'name': 'Logic Games', 'icon': 'fa-brain', 'description': 'Test your logical thinking skills'},
        {'name': 'Debate Simulator', 'icon': 'fa-comments', 'description': 'Practice making arguments on various topics'},
        {'name': 'Science Lab', 'icon': 'fa-atom', 'description': 'Conduct virtual experiments'},
        {'name': 'Creative Writing', 'icon': 'fa-pen-fancy', 'description': 'Write stories with AI assistance'}
    ]
}

# Confusion responses for inappropriate content
CONFUSION_RESPONSES = [
    "Hmm, I'm not sure I understand that question. Let's talk about something else! How about animals or space?",
    "That's a bit confusing for me. Could we talk about science or history instead?",
    "I don't think I can help with that. Would you like to learn about dinosaurs or planets instead?",
    "I'm not programmed to discuss that topic. Let's explore something fun like math games or cool science facts!",
    "I'm a bit confused by that question. How about we talk about something educational instead?",
    "I don't have information on that topic. Would you like to learn about animals, space, or history instead?",
    "That's not something I can help with. Let's find a fun educational topic to explore!",
    "I'm designed to help with educational topics. Can I tell you about dinosaurs, space, or science experiments instead?"
]

# OpenAI API configuration
# API key should be set in .env file, NEVER hardcode it here!
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# Warn if API key is not configured
if not OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY environment variable is not set!")
    print("Please create a .env file with your API key. See .env.example for format.")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/styles.css')
def styles():
    return app.send_static_file('styles.css')

@app.route('/app.js')
def appjs():
    return app.send_static_file('app.js')

@app.route('/api/topics')
def get_topics():
    age_group = request.args.get('age_group', 'middle')
    if age_group not in EDUCATIONAL_TOPICS:
        age_group = 'middle'
    
    return jsonify({
        'topics': EDUCATIONAL_TOPICS[age_group]
    })

@app.route('/api/games')
def get_games():
    age_group = request.args.get('age_group', 'middle')
    if age_group not in EDUCATIONAL_GAMES:
        age_group = 'middle'
    
    return jsonify({
        'games': EDUCATIONAL_GAMES[age_group]
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    age_group = data.get('age_group', 'middle')
    parent_mode = data.get('parent_mode', False)
    
    # Check for inappropriate content
    if contains_inappropriate_content(user_message) and not parent_mode:
        return jsonify({
            'response': random.choice(CONFUSION_RESPONSES)
        })
    
    # Process the message using OpenAI API
    response = generate_openai_response(user_message, age_group)
    
    return jsonify({
        'response': response
    })

def contains_inappropriate_content(message):
    """Check if the message contains inappropriate content"""
    message = message.lower()
    
    # Check against regex patterns
    for pattern in INAPPROPRIATE_PATTERNS:
        if re.search(pattern, message):
            return True
    
    # Check against whole topics/phrases
    for topic in INAPPROPRIATE_TOPICS:
        if topic in message:
            return True
    
    return False

def generate_openai_response(message, age_group):
    """Generate an age-appropriate response using OpenAI API"""
    try:
        # Define age-appropriate language complexity
        language_level = {
            'little': "very simple language suitable for 3-7 year old children",
            'middle': "clear, straightforward language suitable for 8-12 year old children",
            'big': "slightly more advanced language suitable for 13-18 year old teenagers"
        }
        
        # Create system message with safety and age-appropriate instructions
        system_message = f"""
        You are KIDOS AI, a friendly AI assistant for children aged {
            '3-7' if age_group == 'little' else 
            '8-12' if age_group == 'middle' else 
            '13-18'
        }. 
        
        IMPORTANT SAFETY RULES:
        1. NEVER discuss inappropriate topics including: violence, death, drugs, alcohol, sex, profanity, or mature themes
        2. If asked about these topics, politely redirect to educational topics
        3. Keep all content strictly PG-rated and educational
        4. Use {language_level[age_group]}
        5. Be enthusiastic, supportive, and encouraging
        6. Focus on educational content about science, history, animals, space, math, art, and other age-appropriate subjects
        7. Keep responses concise (2-4 sentences for little kids, 3-5 for middle/big kids)
        8. If you don't know something, admit it and suggest learning about a related topic instead
        
        Your goal is to be helpful, educational, and safe for children.
        """
        
        # Prepare the API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7,
            "max_tokens": 150
        }
        
        # Make the API request
        response = requests.post(OPENAI_API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        # Extract and return the AI's response
        if "choices" in response_data and len(response_data["choices"]) > 0:
            ai_message = response_data["choices"][0]["message"]["content"].strip()
            return ai_message
        else:
            # Fallback to rule-based responses if API fails
            return generate_fallback_response(message, age_group)
            
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        # Fallback to rule-based responses if API fails
        return generate_fallback_response(message, age_group)

def generate_fallback_response(message, age_group):
    """Generate a fallback response if OpenAI API fails"""
    message = message.lower()
    
    # Simple keyword-based responses
    if any(word in message for word in ['hello', 'hi', 'hey']):
        if age_group == 'little':
            return "Hello there, friend! It's great to see you! What would you like to learn about today?"
        elif age_group == 'middle':
            return "Hi there! I'm excited to chat with you today. What topic would you like to explore?"
        else:
            return "Hello! I'm here to help you learn and explore new topics. What subject interests you today?"
    
    if 'how are you' in message:
        return "I'm doing great, thanks for asking! I'm always happy to help you learn new things. What would you like to know about?"
    
    if any(word in message for word in ['game', 'play']):
        if age_group == 'little':
            return "I love games! Would you like to play Animal Sounds, Color Match, or Memory Cards? Just click on the Games tab to start playing!"
        elif age_group == 'middle':
            return "Games are a great way to learn! You can try Word Scramble, Math Challenge, or Geography Quiz in the Games section. Which one sounds fun?"
        else:
            return "We have several educational games available like Code Puzzles, Logic Games, and Science Lab. Check out the Games section to get started!"
    
    # Educational topic responses
    if any(word in message for word in ['animal', 'animals']):
        if age_group == 'little':
            return "Animals are amazing! Did you know that a giraffe's tongue is blue? And elephants are the only animals that can't jump! What's your favorite animal?"
        elif age_group == 'middle':
            return "The animal kingdom is fascinating! There are over 1.5 million different animal species on Earth. Would you like to learn about mammals, reptiles, birds, or sea creatures?"
        else:
            return "Zoology is the study of animals. Scientists classify animals into different groups based on their characteristics. Would you like to explore animal adaptations, ecosystems, or endangered species?"
    
    if any(word in message for word in ['space', 'planet', 'star', 'galaxy']):
        if age_group == 'little':
            return "Space is so cool! Our solar system has 8 planets. The biggest one is Jupiter, and we live on Earth! The Sun is a giant star that gives us light and heat."
        elif age_group == 'middle':
            return "Space exploration is amazing! Did you know it takes light from the Sun about 8 minutes to reach Earth? And the International Space Station orbits Earth every 90 minutes!"
        else:
            return "Astronomy reveals the wonders of our universe. Recent discoveries include exoplanets that might support life, and black holes that warp space and time. What aspect of space science interests you most?"
    
    if any(word in message for word in ['dinosaur', 'dinosaurs']):
        if age_group == 'little':
            return "Dinosaurs lived a very long time ago! T-Rex had tiny arms but big teeth. Triceratops had three horns on its face. Which dinosaur do you think is the coolest?"
        elif age_group == 'middle':
            return "Dinosaurs ruled Earth for over 165 million years! Scientists learn about them by studying fossils. Some dinosaurs were as small as chickens, while others were as tall as buildings!"
        else:
            return "Paleontology has revealed much about dinosaurs, including evidence that many species had feathers. The extinction event that wiped them out 66 million years ago was likely caused by an asteroid impact. What aspect of dinosaur science interests you?"
    
    # Default responses if no keywords match
    if age_group == 'little':
        return "That's an interesting question! Would you like to learn about animals, colors, shapes, or space? Or would you like to play a fun game instead?"
    elif age_group == 'middle':
        return "Great question! I can help you learn about science, history, geography, math, or technology. What would you like to explore today?"
    else:
        return "That's a thoughtful question. I can provide information on various academic subjects like computer science, engineering, literature, social sciences, or environmental science. What would you like to know more about?"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
