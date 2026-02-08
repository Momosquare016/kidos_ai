import { FaBookOpen, FaRocket } from 'react-icons/fa';

function LearnSection() {
  return (
    <div className="content-section active">
      <div className="coming-soon-container">
        <div className="coming-soon-icon">
          <FaBookOpen />
        </div>
        <h2 className="coming-soon-title">Learn Section</h2>
        <p className="coming-soon-text">Coming Soon!</p>
        <p className="coming-soon-description">
          We're building fun lessons on science, animals, space, and more. <br />
          <FaRocket className="coming-soon-rocket" /> Stay tuned for something awesome!
        </p>
      </div>
    </div>
  );
}

export default LearnSection;
