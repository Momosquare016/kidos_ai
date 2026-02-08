import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const LOTTIE_URL = 'https://lottie.host/2e9ba763-4092-4a6c-8061-528a5505bfaa/GJxjsWjFKs.json';

function AiAvatar({ isTyping }) {
  const [animationData, setAnimationData] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(() => setLoadFailed(true));
  }, []);

  return (
    <div className={`ai-avatar-wrapper ${isTyping ? 'avatar-talking' : ''}`}>
      <div className="avatar-glow"></div>
      {animationData && !loadFailed ? (
        <div className="avatar-lottie">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div className="avatar-css-robot">
          <div className="robot-head">
            <div className="robot-antenna">
              <div className="antenna-ball"></div>
            </div>
            <div className="robot-face">
              <div className="robot-eye left-eye"></div>
              <div className="robot-eye right-eye"></div>
              <div className={`robot-mouth ${isTyping ? 'mouth-talking' : ''}`}></div>
            </div>
          </div>
          <div className="robot-body">
            <div className="robot-heart"></div>
          </div>
        </div>
      )}
      <div className="avatar-name-tag">KIDOS</div>
    </div>
  );
}

export default AiAvatar;
