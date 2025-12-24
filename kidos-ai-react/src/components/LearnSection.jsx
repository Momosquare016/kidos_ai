import { Row, Col, Card } from 'react-bootstrap';
import { TOPICS } from '../data/content';
import IconComponent from './IconComponent';

function LearnSection({ ageGroup, onTopicClick }) {
  const topics = TOPICS[ageGroup] || TOPICS.middle;

  return (
    <div className="content-section active">
      <h2 className="section-title">Explore and Learn</h2>
      <p className="section-description">
        Discover amazing facts and information about topics you love!
      </p>
      <Row className="topics-container g-4">
        {topics.map((topic, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={4}>
            <Card
              className="topic-card h-100"
              onClick={() => onTopicClick(topic.name)}
            >
              <Card.Body className="text-center">
                <div className="topic-icon">
                  <IconComponent name={topic.icon} />
                </div>
                <h3 className="topic-title">{topic.name}</h3>
                <p className="topic-description">{topic.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LearnSection;
