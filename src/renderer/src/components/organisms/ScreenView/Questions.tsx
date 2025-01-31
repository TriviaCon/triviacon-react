import React from "react";
import { Card, Col, Container, Row, Image } from "react-bootstrap";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Category, Question } from "../../../context/categories";

const Questions: React.FC = () => {
  const [category] = useLocalStorage<Category>("selectedCategory", null);
  const [question] = useLocalStorage<Question>("selectedQuestion", null);
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>{category.name}</h1>
        <hr />
      </div>
      <Container fluid>
        <Row
          xs={1}
          sm={2}
          md={3}
          lg={6}
          className="g-2 justify-content-center align-items-stretch"
        >
          {category.questions.map((q) => (
            <Col key={q.qID} className="d-flex">
              <Card
                className="w-100"
                style={{ backgroundColor: q.used ? "#ccc" : undefined }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h4 mb-1 text-center">
                    <h1>
                      <strong>{category.questions.indexOf(q) + 1}</strong>
                    </h1>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Questions;
