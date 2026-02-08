import { Button } from 'react-bootstrap';
import { FaRobot, FaCog, FaStar, FaRocket } from 'react-icons/fa';

function Header({ onSettingsClick }) {
  return (
    <header className="header-redesign">
      <div className="top-buttons">
        <Button
          variant="primary"
          className="settings-button"
          onClick={onSettingsClick}
        >
          <FaCog /> Settings
        </Button>
      </div>

      <div className="header-content">
        <div className="header-icon-group">
          <FaStar className="header-star star-1" />
          <div className="character">
            <FaRobot />
          </div>
          <FaStar className="header-star star-2" />
        </div>
        <div className="header-text">
          <h1 className="logo">KIDOS AI</h1>
          <p className="tagline">
            <FaRocket className="tagline-icon" /> Learn, Explore, Have Fun!
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
