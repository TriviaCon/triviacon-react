import React from 'react'
import { Card, Col, Container, Row, Image } from 'react-bootstrap'
import {
  RevealedAnswersStorageKey,
  RevealedHintsStorageKey,
  StateQuestion
} from '@renderer/hooks/runtime'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx ¯\_(ツ)_/¯ */
const SingleQuestionView: React.FC = () => {
  const question = JSON.parse(localStorage.getItem('currentQuestion') || 'null');
  const hints = JSON.parse(localStorage.getItem('currentHints') || '[]');
  if (!question) return <div>No question selected.</div>;
  const [revealedAnswers] = useLocalStorage<number[]>(RevealedAnswersStorageKey, [])
  const [revealedHints] = useLocalStorage<number[]>(RevealedHintsStorageKey, [])
  return (
    <Container fluid className="justify-content-space-between">
      <Col className="text-center justify-content-space-between">
        <h1 className="display-4 mb-4">{question?.text}</h1>
        {question?.media && <Image src={question.media} fluid className="mt-1 mb-1" />}

        <div className="mt-auto">
          <h1
            className="display-1"
            style={{
              visibility: revealedAnswers.includes(question.id) ? 'visible' : 'hidden'
            }}
          >
            <strong>{question?.answer}</strong>
          </h1>

          {revealedHints.includes(question.id) && hints.length > 0 && (
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
