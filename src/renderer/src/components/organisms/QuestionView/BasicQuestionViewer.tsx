import React from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  ToggleButton,
} from "react-bootstrap";
import { Category, Question } from "../../../context/categories";

interface BasicQuestionViewerProps {
  selectedCategory: Category | null;
  selectedQuestion: Question | null;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
}

const BasicQuestionViewer: React.FC<BasicQuestionViewerProps> = ({
  selectedCategory,
  selectedQuestion,
  updateQuestion,
}) => {
  if (!selectedQuestion) return <div>No question selected</div>;
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h2>{selectedQuestion?.text}</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h3>{selectedQuestion?.answer}</h3>
        </Col>
      </Row>
      <Row className="mb-1">
        <Col xs={3}>
          <strong>Media</strong>
        </Col>
        <Col xs={9}>
          <Card className="mb-2">
            <Card.Body>
              <Row>
                <Col>{selectedQuestion?.media || "N/A"}</Col>
                <Col className="border-start">
                  Controls
                  <Row>
                    <Col>
                      <ToggleButton
                        type="checkbox"
                        variant="secondary"
                        value="1"
                      >
                        Fullscreen
                      </ToggleButton>
                    </Col>
                    <Col></Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <strong>Reveal Hints</strong>
        </Col>
        <Col xs={9}>
          <Form.Check
            type="switch"
            id="revealhints-switch"
            name="revealHints"
            label={selectedQuestion?.hintsRevealed ? "Yes" : "No"}
            checked={selectedQuestion?.hintsRevealed}
            onChange={() => {
              if (selectedQuestion && selectedCategory) {
                const updatedQuestion = {
                  ...selectedQuestion,
                  hintsRevealed: !selectedQuestion.hintsRevealed,
                };
                updateQuestion(selectedQuestion.qID, updatedQuestion);
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <strong>Hints</strong>
        </Col>
        <Col xs={9}>
          {selectedQuestion?.hints && selectedQuestion.hints.length > 0
            ? selectedQuestion.hints.map((hint, index) => (
                <Alert key={index} variant="info" className="mb-2">
                  {hint}
                </Alert>
              ))
            : "No hints"}
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <strong>Used</strong>
        </Col>
        <Col xs={9}>
          <Form.Check
            type="switch"
            id="used-switch"
            name="used"
            label={selectedQuestion?.used ? "Yes" : "No"}
            checked={selectedQuestion?.used}
            onChange={() => {
              if (selectedQuestion && selectedCategory) {
                const updatedQuestion = {
                  ...selectedQuestion,
                  used: !selectedQuestion.used,
                };
                updateQuestion(selectedQuestion.qID, updatedQuestion);
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <strong>Reveal Answer</strong>
        </Col>
        <Col xs={9}>
          <Form.Check
            type="switch"
            name="answerRevealed"
            id="answer-reveal-switch"
            label={selectedQuestion?.answerRevealed ? "Yes" : "No"}
            checked={selectedQuestion?.answerRevealed}
            onChange={() => {
              if (selectedQuestion && selectedCategory) {
                const updatedQuestion = {
                  ...selectedQuestion,
                  answerRevealed: !selectedQuestion.answerRevealed,
                };
                updateQuestion(selectedQuestion.qID, updatedQuestion);
              }
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default BasicQuestionViewer;
