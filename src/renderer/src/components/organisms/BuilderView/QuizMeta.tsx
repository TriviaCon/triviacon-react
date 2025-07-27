import { Alert, Button, Col, Form, Row, Image } from 'react-bootstrap'
import { useState } from 'react'
import { QuizStatsModal } from './QuizStatsModal'
import { BarChartLine, InfoCircle } from 'react-bootstrap-icons'
import {
  useQuizMeta,
  useUpdateName,
  useUpdateAuthor,
  useUpdateDate,
  useUpdateLocation
} from '@renderer/hooks/useQuizMeta'

export const QuizMeta = () => {
  const meta = useQuizMeta()
  const updateName = useUpdateName()
  const updateAuthor = useUpdateAuthor()
  const updateDate = useUpdateDate()
  const updateLocation = useUpdateLocation()
  const [showStatsModal, setShowStatsModal] = useState(false)

  if (!meta.data) {
    return 'loading...'
  }

  return (
    <>
      <h2>Quiz</h2>
      <Row>
        <Alert variant="light">
          <Alert.Heading>
            <InfoCircle className="me-2" />
            Quiz Info
            <Button onClick={() => setShowStatsModal(true)} size="sm" className="float-end">
              <BarChartLine />
              Stats
            </Button>
          </Alert.Heading>
          <Form>
            <Row>
              <Col sm={8}>
                <Row className="mb-1">
                  <Form.Label column sm={2} style={{ textAlign: 'right', paddingRight: 2 }}>
                    Name
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Quiz Name"
                      value={meta.data.name}
                      onChange={(e) => updateName.mutate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} style={{ textAlign: 'right', paddingRight: 4 }}>
                    Author
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Quiz Author"
                      value={meta.data.author}
                      onChange={(e) => updateAuthor.mutate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} style={{ textAlign: 'right', paddingRight: 4 }}>
                    Date
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="date"
                      value={meta.data.date}
                      onChange={(e) => updateDate.mutate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} style={{ textAlign: 'right', paddingRight: 4 }}>
                    Location
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Quiz Location"
                      value={meta.data.location}
                      onChange={(e) => updateLocation.mutate(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Image
                  src={meta.data.splash ?? 'https://placehold.co/1280x720/transparent/CCC.png'}
                  thumbnail
                />
              </Col>
            </Row>
          </Form>
        </Alert>
      </Row>
      <QuizStatsModal show={showStatsModal} onHide={() => setShowStatsModal(false)} />
    </>
  )
}
