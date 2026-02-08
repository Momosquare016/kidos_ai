import { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import { containsInappropriateContent } from '../utils/contentFilter';
import { callGeminiAPI } from '../utils/geminiApi';
import { generateLocalResponse } from '../utils/localResponses';
import { RESTRICTED_RESPONSE } from '../data/content';
import AiAvatar from './AiAvatar';

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
    const welcomeMessage = "Hey there! I'm KIDOS, your AI buddy! Ask me anything about animals, space, science, or whatever you're curious about!";
    setMessages([{ sender: 'ai', text: welcomeMessage }]);
  }, []);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { sender, text, timestamp: new Date().toISOString() }]);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

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

    try {
      const aiResponse = await callGeminiAPI(message, apiKey, ageGroup, conversationHistory);
      setIsTyping(false);

      if (containsInappropriateContent(aiResponse)) {
        addMessage(
          "I have a great answer, but let me rephrase it in a more kid-friendly way! What specifically would you like to know about this topic?",
          'ai'
        );
      } else {
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

      if (error.message && (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403'))) {
        addMessage(
          "Oops! There's an issue connecting to my brain. Please check the API key in Settings!",
          'ai'
        );
      } else {
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
      <div className="chat-with-avatar">
        <div className="avatar-sidebar">
          <AiAvatar isTyping={isTyping} />
        </div>
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
              placeholder="Ask me anything..."
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
    </div>
  );
}

export default ChatSection;
