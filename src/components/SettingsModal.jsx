import { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaCog, FaSave, FaEye, FaEyeSlash, FaTrash, FaRedo } from 'react-icons/fa';
import { testApiKey } from '../utils/geminiApi';

function SettingsModal({ show, onHide, apiKey, onApiKeySave, onClearChat, onResetProgress }) {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setKeyInput(apiKey);
    }
  }, [apiKey]);

  const handleSaveKey = async () => {
    const key = keyInput.trim();

    if (!key) {
      setStatus({ message: 'Please enter an API key', type: 'error' });
      return;
    }

    setStatus({ message: 'Testing API key...', type: '' });
    setIsTesting(true);

    try {
      const isValid = await testApiKey(key);

      if (isValid) {
        onApiKeySave(key);
        setStatus({ message: 'API key saved successfully! You can now chat with KIDOS AI.', type: 'success' });
        setTimeout(() => {
          onHide();
        }, 1500);
      } else {
        setStatus({ message: 'Invalid API key. Please check and try again.', type: 'error' });
      }
    } catch (error) {
      setStatus({ message: 'Error testing API key. Please try again.', type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      onClearChat();
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress and badges?')) {
      onResetProgress();
      alert('Progress has been reset!');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="settings-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCog /> Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="settings-section">
          <h5>Google Gemini API Key</h5>
          <p className="settings-description">
            To enable AI chat, you need a free Gemini API key from Google.{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              Get your free API key here
            </a>
          </p>
          <InputGroup className="mb-3">
            <Form.Control
              type={showKey ? 'text' : 'password'}
              placeholder="Enter your Gemini API key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setShowKey(!showKey)}>
              {showKey ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
          <Button
            variant="primary"
            className="save-api-key-btn"
            onClick={handleSaveKey}
            disabled={isTesting}
          >
            <FaSave /> Save API Key
          </Button>
          {status.message && (
            <p className={`api-status mt-2 ${status.type}`}>{status.message}</p>
          )}
        </div>

        <hr />

        <div className="settings-section">
          <h5>Clear Chat History</h5>
          <p className="settings-description">Clear all messages and start fresh.</p>
          <Button variant="warning" className="clear-chat-btn" onClick={handleClearChat}>
            <FaTrash /> Clear Chat
          </Button>
        </div>

        <hr />

        <div className="settings-section">
          <h5>Reset Progress</h5>
          <p className="settings-description">Reset all badges, stats, and learning progress.</p>
          <Button variant="danger" className="reset-progress-btn" onClick={handleResetProgress}>
            <FaRedo /> Reset Progress
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SettingsModal;
