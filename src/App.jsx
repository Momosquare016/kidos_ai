import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ChatSection from './components/ChatSection';
import LearnSection from './components/LearnSection';
import GamesSection from './components/GamesSection';
import SettingsModal from './components/SettingsModal';
import { FaEnvelope } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('chat');
  const [showSettings, setShowSettings] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleClearChat = () => {
    setChatKey(prev => prev + 1);
  };

  return (
    <div className="main-wrapper">
      <Container className="app-container">
        <Header onSettingsClick={() => setShowSettings(true)} />

        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {activeSection === 'chat' && (
          <ChatSection key={chatKey} />
        )}

        {activeSection === 'learn' && <LearnSection />}

        {activeSection === 'games' && <GamesSection />}

        <footer className="app-footer text-center py-4">
          <p>&copy; 2025 KIDOS AI - A safe learning environment for children</p>
          <div className="footer-links">
            <a href="mailto:monotify016@gmail.com" className="footer-link">
              <FaEnvelope /> monotify016@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/muhammad-ali-r-35a9762b4/" target="_blank" rel="noopener noreferrer" className="footer-link">
              <FaLinkedin /> LinkedIn
            </a>
          </div>
        </footer>

        <SettingsModal
          show={showSettings}
          onHide={() => setShowSettings(false)}
          onClearChat={handleClearChat}
        />
      </Container>
    </div>
  );
}

export default App;
