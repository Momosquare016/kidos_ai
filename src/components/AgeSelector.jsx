import { ButtonGroup, Button } from 'react-bootstrap';

function AgeSelector({ currentAge, onAgeChange }) {
  const ageGroups = [
    { id: 'little', label: 'Little Kids (3-7)' },
    { id: 'middle', label: 'Middle Kids (8-12)' },
    { id: 'big', label: 'Big Kids (13-18)' }
  ];

  return (
    <div className="age-selector d-flex justify-content-center gap-3 mb-4 flex-wrap">
      {ageGroups.map((age) => (
        <Button
          key={age.id}
          className={`age-button ${currentAge === age.id ? 'active' : ''}`}
          id={`${age.id}-kids`}
          onClick={() => onAgeChange(age.id)}
        >
          {age.label}
        </Button>
      ))}
    </div>
  );
}

export default AgeSelector;
