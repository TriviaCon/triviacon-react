import { Card, Col, Container, Row } from 'react-bootstrap'
import type { Category } from '@shared/types/quiz'

const QuestionsScreen = ({
  categories,
  currentCategoryId
}: {
  categories: Category[]
  currentCategoryId: number | null
}) => {
  const category = categories.find((c) => c.id === currentCategoryId)

  return (
    <Container fluid className="py-4">
      <div style={{ textAlign: 'center' }}>
        <h1 className="display-3">{category?.name ?? 'Questions'}</h1>
        <hr />
      </div>
      <Row xs={1} sm={2} md={3} lg={6} className="g-2 justify-content-center align-items-stretch">
        <Col className="d-flex">
          <Card className="w-100">
            <Card.Body className="text-center">
              <p className="text-muted">
                Questions are displayed from the control panel.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default QuestionsScreen
