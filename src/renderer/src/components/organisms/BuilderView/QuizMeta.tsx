import { Alert, Button, Col, Form, Row, Image } from "react-bootstrap";
import { useCategories } from "../../../hooks/useCategories";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useState } from "react";
import { QuizStatsModal } from "./QuizStatsModal";
import { BarChartLine, InfoCircle, Upload } from "react-bootstrap-icons";

export const QuizMeta = () => {
  const { categories } = useCategories();
  const [quizInfo, setQuizInfo] = useLocalStorage("quizInfo", {
    quizName: "",
    quizAuthor: "",
    quizLocation: "",
    quizDate: "",
    quizImage: "",
  });
  const [showStatsModal, setShowStatsModal] = useState(false);

  return (
    <>
      <h2>Quiz</h2>
      <Row>
        <Alert variant="light">
          <Alert.Heading>
            <InfoCircle className="me-2"/>Quiz Info
            <Button size="sm" className="float-end" onClick={() => setShowStatsModal(true)}>
              <BarChartLine className="me-2"/>Stats
            </Button>
          </Alert.Heading>
          <Form>
            <Row>
              <Col sm={6}>
                <Row className="mb-1">
                  <Form.Label column sm={2} className="text-end">Name</Form.Label>
                  <Col sm={10}>
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
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} className="text-end">Author</Form.Label>
                  <Col sm={10}>
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
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} className="text-end">Date</Form.Label>
                  <Col sm={10}>
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
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Form.Label column sm={2} className="text-end">Location</Form.Label>
                  <Col sm={10}>
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
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <Image className="me-2" />Splash Image
                <Image src={quizInfo.quizImage || "https://placehold.co/1280x720/transparent/CCC.png"} thumbnail/>
              </Col>
            </Row>
          </Form>
        </Alert>
      </Row>
      <QuizStatsModal show={showStatsModal} onHide={() => setShowStatsModal(false)} />
    </>
  );
};