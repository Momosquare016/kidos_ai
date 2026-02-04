import json
import os
import requests

# Groq API configuration
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_response(message, age_group='middle'):
    """Generate an age-appropriate response using Groq API"""
    if not GROQ_API_KEY:
        return "API key not configured. Please contact the administrator."

    try:
        language_level = {
            'little': "very simple language suitable for 3-7 year old children",
            'middle': "clear, straightforward language suitable for 8-12 year old children",
            'big': "slightly more advanced language suitable for 13-18 year old teenagers"
        }

        system_message = f"""You are KIDOS AI, a friendly AI assistant for children aged {
            '3-7' if age_group == 'little' else
            '8-12' if age_group == 'middle' else
            '13-18'
        }.

        IMPORTANT SAFETY RULES:
        1. NEVER discuss inappropriate topics including: violence, death, drugs, alcohol, sex, profanity, or mature themes
        2. If asked about these topics, politely redirect to educational topics
        3. Keep all content strictly PG-rated and educational
        4. Use {language_level.get(age_group, language_level['middle'])}
        5. Be enthusiastic, supportive, and encouraging
        6. Focus on educational content about science, history, animals, space, math, art, and other age-appropriate subjects
        7. Keep responses concise (2-4 sentences for little kids, 3-5 for middle/big kids)

        Your goal is to be helpful, educational, and safe for children.
        """

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7,
            "max_tokens": 512
        }

        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response_data = response.json()

        if "choices" in response_data and len(response_data["choices"]) > 0:
            return response_data["choices"][0]["message"]["content"].strip()
        else:
            return "I'm having trouble thinking right now. Can you ask me something about animals, space, or science?"

    except Exception as e:
        print(f"Error: {str(e)}")
        return "I'm having trouble connecting right now. Please try again!"


from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            message = data.get('message', '')
            age_group = data.get('age_group', 'middle')

            response_text = generate_response(message, age_group)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            response = json.dumps({'response': response_text})
            self.wfile.write(response.encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
