import { Button } from 'react-bootstrap';
import { FaRobot, FaCog } from 'react-icons/fa';

function Header({ onSettingsClick, parentMode, onParentModeToggle }) {
  return (
    <header className="text-center py-4 mb-4 position-relative">
      <div className="top-buttons">
        <Button
          variant="primary"
          className="settings-button"
          onClick={onSettingsClick}
        >
          <FaCog /> Settings
        </Button>
        <Button
          variant="secondary"
          className="parent-mode-button"
          onClick={onParentModeToggle}
        >
          {parentMode ? 'Exit Parent Mode' : 'Parent Mode'}
        </Button>
      </div>

      <div className="character">
        <FaRobot />
      </div>
      <h1 className="logo">KIDOS AI</h1>
      <p className="tagline">Your Friendly Learning Companion!</p>
    </header>
  );
}

export default Header;
