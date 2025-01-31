import { Alert, Col, Form, Row, Table } from "react-bootstrap";
import { useCategories } from "../../../hooks/useCategories";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

export const QuizMeta = () => {
  const { categories } = useCategories();
  const [quizInfo, setQuizInfo] = useLocalStorage("quizInfo", {
    quizName: "",
    quizAuthor: "",
    quizLocation: "",
    quizDate: "",
  });
  return (
    <>
      <h2>Quiz</h2>
      <Row>
        <Col>
          <Alert variant="light">
            <Form>
              <h6>
                <i className="bi bi-info-circle me-2"></i>Quiz Info
              </h6>
              <Row className="mb-1">
                <Col>
                  <Form.Group controlId="quizName">
                    <Form.Label>Quiz Name</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Quiz Name"
                      value={quizInfo.quizName}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          quizName: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="quizAuthor">
                    <Form.Label>Quiz Author</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Quiz Author"
                      value={quizInfo.quizAuthor}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          quizAuthor: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col>
                  <Form.Group controlId="quizDate">
                    <Form.Label>Quiz Date</Form.Label>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={quizInfo.quizDate}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          quizDate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="quizLocation">
                    <Form.Label>Quiz Location</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Quiz Location"
                      value={quizInfo.quizLocation}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          quizLocation: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Alert>
        </Col>
        <Col>
          <Alert variant="info">
            <h6 className="alert-heading">
              <i className="bi bi-bar-chart-line me-2"></i>Quiz Statistics
            </h6>
            <Table size="sm" bordered variant="info">
              <tbody>
                <tr>
                  <td className="text-end" style={{ whiteSpace: "nowrap" }}>
                    <strong>Total Categories</strong>
                  </td>
                  <td className="text-start">{categories.length}</td>
                </tr>
                <tr>
                  <td className="text-end" style={{ whiteSpace: "nowrap" }}>
                    <strong>Total Questions</strong>
                  </td>
                  <td className="text-start">
                    {categories.reduce(
                      (total, category) => total + category.questions.length,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-end" style={{ whiteSpace: "nowrap" }}>
                    <strong>Media Questions</strong>
                  </td>
                  <td className="text-start">
                    {categories.reduce(
                      (total, category) =>
                        total +
                        category.questions.filter((question) => question.media)
                          .length,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Alert>
        </Col>
      </Row>
    </>
  );
};
