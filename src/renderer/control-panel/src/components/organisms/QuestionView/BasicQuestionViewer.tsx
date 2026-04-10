import { AnswerOption, Question } from '@shared/types/quiz'
import { Alert, Card, Col, Container, Form, Row, ToggleButton } from 'react-bootstrap'

const BasicQuestionViewer = ({
  question,
  answerOptions,
  answerRevealed,
  onRevealAnswer,
  used,
  onUse
}: {
  question: Question
  answerOptions: AnswerOption[]
  answerRevealed: boolean
  onRevealAnswer: VoidFunction
  used: boolean
  onUse: VoidFunction
}) => {
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h2>{question.text}</h2>
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
                <Col>{question.media && <img src={question.media} />}</Col>
                <Col className="border-start">
                  Controls
                  <Row>
                    <Col>
                      <ToggleButton
                        id="fullscreen-toggle"
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
          <strong>Answer Options</strong>
        </Col>
        <Col xs={9}>
          {answerOptions.length > 0
            ? answerOptions.map((opt, index) => (
                <Alert
                  key={opt.id}
                  variant={answerRevealed && opt.correct ? 'success' : 'info'}
                  className="mb-2"
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong> {opt.text}
                  {answerRevealed && opt.correct && ' \u2714'}
                </Alert>
              ))
            : 'No answer options'}
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
            label={used ? 'Yes' : 'No'}
            checked={used}
            onChange={onUse}
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
            label={answerRevealed ? 'Yes' : 'No'}
            checked={answerRevealed}
            onChange={onRevealAnswer}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default BasicQuestionViewer
