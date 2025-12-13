import { useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import AgeSelector from './components/AgeSelector';
import Navigation from './components/Navigation';
import ChatSection from './components/ChatSection';
import LearnSection from './components/LearnSection';
import GamesSection from './components/GamesSection';
import SettingsModal from './components/SettingsModal';
import './App.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function App() {
  const [ageGroup, setAgeGroup] = useState('middle');
  const [activeSection, setActiveSection] = useState('chat');
  const [parentMode, setParentMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleParentModeToggle = () => {
    setParentMode(!parentMode);
    alert(
      !parentMode
        ? 'Parent Mode activated. Content filtering is less restrictive for educational purposes.'
        : 'Parent Mode deactivated. Full content filtering is now active.'
    );
  };

  const handleTopicClick = (topicName) => {
    setActiveSection('chat');
  };

  const handleClearChat = () => {
    setChatKey(prev => prev + 1);
  };

  const handleResetProgress = () => {
    localStorage.removeItem('kidosStats');
  };

  return (
    <div className="main-wrapper">
      <Container className="app-container">
        <Header
          onSettingsClick={() => setShowSettings(true)}
          parentMode={parentMode}
          onParentModeToggle={handleParentModeToggle}
        />

        <AgeSelector currentAge={ageGroup} onAgeChange={setAgeGroup} />

        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {activeSection === 'chat' && (
          <ChatSection key={chatKey} apiKey={API_KEY} ageGroup={ageGroup} />
        )}

        {activeSection === 'learn' && (
          <LearnSection
            ageGroup={ageGroup}
            onTopicClick={handleTopicClick}
          />
        )}

        {activeSection === 'games' && <GamesSection ageGroup={ageGroup} />}

        <footer className="text-center py-4">
          <p>&copy; 2025 KIDOS AI - A safe learning environment for children</p>
        </footer>

        <SettingsModal
          show={showSettings}
          onHide={() => setShowSettings(false)}
          onClearChat={handleClearChat}
          onResetProgress={handleResetProgress}
        />
      </Container>
    </div>
  );
}

export default App;
