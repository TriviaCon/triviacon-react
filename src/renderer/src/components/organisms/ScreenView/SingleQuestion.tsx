import React from 'react'
import { Card, Col, Container, Row, Image } from 'react-bootstrap'
import { StateQuestion } from '@renderer/hooks/runtime'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx ¯\_(ツ)_/¯ */
const SingleQuestionView: React.FC = ({
  question,
  hints,
  answerRevealed
}: StateQuestion['data']) => {
  return (
    <Container fluid className="justify-content-space-between">
      <Col className="text-center justify-content-space-between">
        <h1 className="display-4 mb-4">{question?.text}</h1>
        {question?.media && <Image src={question.media} fluid className="mt-1 mb-1" />}

        <div className="mt-auto">
          <h1
            className="display-1"
            style={{
              visibility: answerRevealed ? 'visible' : 'hidden'
            }}
          >
            <strong>{question?.answer}</strong>
          </h1>

          {hints.length > 0 && (
            <Row className="mt-3">
              {hints.map((hint, index) => (
                <Col key={index} xs={12} sm={6} className="mb-3">
                  <Card bg="light" text="dark">
                    <Card.Body>
                      <Card.Text className="h1">
                        {String.fromCharCode(65 + index)}. {hint.hint}
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
