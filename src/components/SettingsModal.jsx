import { Modal, Button } from 'react-bootstrap';
import { FaCog, FaTrash, FaRedo } from 'react-icons/fa';

function SettingsModal({ show, onHide, onClearChat, onResetProgress }) {
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
