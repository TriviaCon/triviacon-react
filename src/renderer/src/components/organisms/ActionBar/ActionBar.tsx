import React from "react";
import { Button } from "react-bootstrap";
import { useCategories } from "../../../hooks/useCategories";

interface ActionBarProps {
  activeTab: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ activeTab }) => {
  const { loadQuizData } = useCategories();
  return (
    <div className="d-flex mb-2 pb-2 border-bottom">
      {activeTab === "builder" ? (
        <>
          <Button
            variant="primary"
            className="me-1"
            onClick={() => {
              if (
                confirm(
                  "Create a new, empty Quiz? \n\nUnsaved changes will be lost!"
                )
              ) {
                localStorage.clear();
                loadQuizData("/blankQuiz.json");
                window.location.reload();
              }
            }}
          >
            <i className="bi bi-file-earmark-plus me-1"></i>New Quiz
          </Button>
          <Button
            variant="warning"
            className="me-1"
            onClick={() =>
              confirm("Load a Quiz? \n\nUnsaved changes will be lost!")
            }
          >
            <i className="bi bi-upload me-1"></i>Load Quiz
          </Button>
          <Button
            variant="success"
            onClick={() =>
              alert("Quiz {quizName_quizDate} saved successfully!")
            }
          >
            <i className="bi bi-floppy me-1"></i>Save Quiz
          </Button>
        </>
      ) : (
        <Button
          variant="danger"
          className="me-1"
          onClick={() => {
            if (confirm("Run the quiz?") == true) {
              if (window.QuizRunnerWindow && !window.QuizRunnerWindow.closed) {
                alert("Quiz Runner is already open!");
              } else {
                const currentUrl = window.location.href;
                const [baseUrl, hash] = currentUrl.split("#");
                const separator = baseUrl.includes("?") ? "&" : "?";
                const newWindowUrl = `${baseUrl}${separator}screen=true${
                  hash ? `#${hash}` : ""
                }`;

                window.QuizRunnerWindow = window.open(
                  newWindowUrl,
                  "QuizRunner",
                  "toolbar=no,scrollbars=no,resizable=yes,width=1280,height=720"
                );
              }
            } else {
              alert("Quiz {quizName_quizDate} cancelled!");
            }
          }}
        >
          <i className="bi bi-play me-1"></i>
          <strong>RUN QUIZ</strong>
        </Button>
      )}
    </div>
  );
};

export default ActionBar;
