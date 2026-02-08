import { Modal, Button } from 'react-bootstrap';
import { FaCog, FaTrash } from 'react-icons/fa';

function SettingsModal({ show, onHide, onClearChat }) {
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      onClearChat();
      onHide();
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
          <h5>Clear Chat History</h5>
          <p className="settings-description">Clear all messages and start a fresh conversation.</p>
          <Button variant="warning" className="clear-chat-btn" onClick={handleClearChat}>
            <FaTrash /> Clear Chat
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SettingsModal;
