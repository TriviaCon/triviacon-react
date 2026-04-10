import { Card, Col, Container, Row } from 'react-bootstrap'
import type { Category } from '@shared/types/quiz'

const CategoriesScreen = ({ categories }: { categories: Category[] }) => {
  return (
    <Container fluid className="py-4">
      <div style={{ textAlign: 'center' }}>
        <h1 className="display-3">CATEGORIES</h1>
        <hr />
      </div>
      <Row xs={1} sm={2} md={3} lg={6} className="g-2 justify-content-center align-items-stretch">
        {categories.length === 0 ? (
          <div className="text-center">No categories available.</div>
        ) : (
          categories.map((category) => (
            <Col key={category.id} className="d-flex">
              <Card className="w-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h4 mb-1 text-center">
                    <strong>{category.name}</strong>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  )
}

export default CategoriesScreen
