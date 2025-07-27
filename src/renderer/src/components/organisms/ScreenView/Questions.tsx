import { StateQuestions } from '@renderer/hooks/runtime'
import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx ¯\_(ツ)_/¯ */
const Questions: React.FC = ({ category, questions }: StateQuestions['data']) => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>{category.name}</h1>
        <hr />
      </div>
      <Container fluid>
        <Row xs={1} sm={2} md={3} lg={6} className="g-2 justify-content-center align-items-stretch">
          {questions.length === 0 ? (
            <div>No questions available.</div>
          ) : (
            questions.map((q) => (
              <Col key={q.id} className="d-flex">
                <Card
                  className="w-100"
                  style={{ backgroundColor: '' /*q.used ? '#ccc' : undefined*/ }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h4 mb-1 text-center">
                      <h1>
                        <strong>{questions.indexOf(q) + 1}</strong>
                      </h1>
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  )
}

export default Questions
