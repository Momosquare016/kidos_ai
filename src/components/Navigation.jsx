import { ButtonGroup, Button } from 'react-bootstrap';

function Navigation({ activeSection, onSectionChange }) {
  const sections = [
    { id: 'chat', label: 'Chat' },
    { id: 'learn', label: 'Learn' },
    { id: 'games', label: 'Games' }
  ];

  return (
    <div className="main-nav d-flex justify-content-center gap-3 mb-4 flex-wrap">
      {sections.map((section) => (
        <Button
          key={section.id}
          className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
          id={`${section.id}-nav`}
          onClick={() => onSectionChange(section.id)}
        >
          {section.label}
        </Button>
      ))}
    </div>
  );
}

export default Navigation;
