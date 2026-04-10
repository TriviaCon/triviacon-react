import { Card, Col, Container, Image, Row } from 'react-bootstrap'
import type { ActiveQuestionState } from '@shared/types/state'

const QuestionScreen = ({
  activeQuestion
}: {
  activeQuestion: ActiveQuestionState | null
}) => {
  if (!activeQuestion) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center vh-100">
        <h2 className="text-muted">No question selected</h2>
      </Container>
    )
  }

  const { question, answerOptions, answerRevealed } = activeQuestion
  const correctOptions = answerOptions.filter((opt) => opt.correct)

  return (
    <Container fluid className="py-4">
      <Col className="text-center">
        <h1 className="display-4 mb-4">{question.text}</h1>
        {question.media && <Image src={question.media} fluid className="mt-1 mb-3" />}

        <h1
          className="display-1"
          style={{ visibility: answerRevealed ? 'visible' : 'hidden' }}
        >
          <strong>{correctOptions.map((o) => o.text).join(', ')}</strong>
        </h1>

        {answerOptions.length > 1 && (
          <Row className="mt-3">
            {answerOptions.map((opt, index) => (
              <Col key={opt.id} xs={12} sm={6} className="mb-3">
                <Card
                  bg={answerRevealed && opt.correct ? 'success' : 'light'}
                  text={answerRevealed && opt.correct ? 'white' : 'dark'}
                >
                  <Card.Body>
                    <Card.Text className="h1">
                      {String.fromCharCode(65 + index)}. {opt.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Container>
  )
}

export default QuestionScreen
