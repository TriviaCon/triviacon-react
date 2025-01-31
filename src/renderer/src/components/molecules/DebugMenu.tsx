import React from "react";
import { useCategories } from "../../hooks/useCategories";
import { Navbar, Nav, Dropdown } from "react-bootstrap";

const DebugMenu: React.FC = () => {
  const { loadQuizData } = useCategories();
  return (
    <>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle id="debug-dropdown">
              <i className="bi bi-bug"></i> Debug
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                <i className="bi bi-trash me-2"></i>Clear Local Storage
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={async () => {
                  localStorage.clear();
                  await loadQuizData("/mockQuiz.json");
                  window.location.reload();
                }}
              >
                <i className="bi bi-question-octagon me-2"></i>Load Mock Quiz
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={async () => {
                  localStorage.clear();
                  await loadQuizData("/big_mockQuiz.json");
                  window.location.reload();
                }}
              >
                <i
                  className="bi bi-exclamation-triangle-fill me-2"
                  style={{ color: "red" }}
                ></i>
                Load BIG Quiz
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#">
                <i className="bi bi-github me-2"></i> Submit Bug Report
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </>
  );
};

export default DebugMenu;
