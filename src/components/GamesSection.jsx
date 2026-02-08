import { FaGamepad, FaRocket } from 'react-icons/fa';

function GamesSection() {
  return (
    <div className="content-section active">
      <div className="coming-soon-container">
        <div className="coming-soon-icon">
          <FaGamepad />
        </div>
        <h2 className="coming-soon-title">Games Section</h2>
        <p className="coming-soon-text">Coming Soon!</p>
        <p className="coming-soon-description">
          Fun educational games are on the way. <br />
          <FaRocket className="coming-soon-rocket" /> Get ready to learn while you play!
        </p>
      </div>
    </div>
  );
}

export default GamesSection;
