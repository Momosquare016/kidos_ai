import { useState, useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import { containsInappropriateContent } from '../utils/contentFilter';
import { callGeminiAPI } from '../utils/geminiApi';
import { generateLocalResponse } from '../utils/localResponses';
import { RESTRICTED_RESPONSE } from '../data/content';

function ChatSection({ apiKey, ageGroup }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show welcome message
    const welcomeMessage = apiKey
      ? "Hello! I'm KIDOS AI, your friendly learning companion! What would you like to learn about today? You can ask me about animals, space, dinosaurs, science, and more!"
      : "Welcome to KIDOS AI! To start chatting with me, please click the 'Settings' button at the top and add your free Gemini API key. It only takes a minute to set up!";

    setMessages([{ sender: 'ai', text: welcomeMessage }]);
  }, []);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { sender, text, timestamp: new Date().toISOString() }]);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    // Check for inappropriate content
    if (containsInappropriateContent(message)) {
      addMessage(message, 'user');
      setInputValue('');
      setTimeout(() => {
        addMessage(RESTRICTED_RESPONSE, 'ai');
      }, 500);
      return;
    }

    addMessage(message, 'user');
    setInputValue('');
    setIsTyping(true);

    // Check if API key is set
    if (!apiKey) {
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Please set up your Gemini API key first! Click the 'Settings' button at the top to add your free API key from Google AI Studio.",
          'ai'
        );
      }, 500);
      return;
    }

    try {
      const aiResponse = await callGeminiAPI(message, apiKey, ageGroup, conversationHistory);
      setIsTyping(false);

      // Double-check AI response for inappropriate content
      if (containsInappropriateContent(aiResponse)) {
        addMessage(
          "I have a great answer, but let me rephrase it in a more kid-friendly way! What specifically would you like to know about this topic?",
          'ai'
        );
      } else {
        // Add to conversation history
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', text: message },
          { role: 'model', text: aiResponse }
        ]);
        addMessage(aiResponse, 'ai');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setIsTyping(false);

      if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403')) {
        addMessage(
          "There's an issue with the API key. Please check your settings and make sure you've entered a valid Gemini API key!",
          'ai'
        );
      } else {
        // Fallback to local response
        addMessage(generateLocalResponse(message), 'ai');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="content-section active">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message ai-message typing-indicator">
              <div className="loading">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <Button className="voice-input-button" variant="light">
            <FaMicrophone />
          </Button>
          <Form.Control
            type="text"
            className="message-input"
            placeholder="Type your question here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button className="send-button" onClick={handleSendMessage}>
            <FaPaperPlane /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
