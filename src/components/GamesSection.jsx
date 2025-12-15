import { Row, Col, Card } from 'react-bootstrap';
import { GAMES } from '../data/content';
import IconComponent from './IconComponent';

function GamesSection({ ageGroup }) {
  const games = GAMES[ageGroup] || GAMES.middle;

  const handleGameClick = (gameName) => {
    alert(`${gameName} game would launch here. This is a placeholder for the actual game implementation.`);
  };

  return (
    <div className="content-section active">
      <h2 className="section-title">Fun Learning Games</h2>
      <p className="section-description">
        Play these educational games to boost your brain power!
      </p>
      <Row className="games-container g-4">
        {games.map((game, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={4}>
            <Card
              className="game-card h-100"
              onClick={() => handleGameClick(game.name)}
            >
              <Card.Body className="text-center">
                <div className="game-icon">
                  <IconComponent name={game.icon} />
                </div>
                <h3 className="game-title">{game.name}</h3>
                <p className="game-description">{game.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default GamesSection;
