import React from 'react'
import { Card, Col, Container, Row, Image } from 'react-bootstrap'
import { StateQuestion } from '@renderer/hooks/runtime'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx */
const SingleQuestionView: React.FC = ({
  question,
  answerOptions,
  answerRevealed
}: StateQuestion['data']) => {
  const correctOptions = answerOptions.filter((opt) => opt.correct)

  return (
    <Container fluid className="justify-content-space-between">
      <Col className="text-center justify-content-space-between">
        <h1 className="display-4 mb-4">{question?.text}</h1>
        {question?.media && <Image src={question.media} fluid className="mt-1 mb-1" />}

        <div className="mt-auto">
          {/* Show correct answer(s) when revealed */}
          <h1
            className="display-1"
            style={{
              visibility: answerRevealed ? 'visible' : 'hidden'
            }}
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
        </div>
      </Col>
    </Container>
  )
}
export default SingleQuestionView
