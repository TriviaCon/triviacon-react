import React from "react";
import { Button, Dropdown, SplitButton } from "react-bootstrap";
import { useCategories } from "../../../hooks/useCategories";
import { FileEarmarkPlus, Floppy, Floppy2, PlayFill, Upload } from "react-bootstrap-icons";

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
                loadQuizData("/blankQuiz.json");
                localStorage.clear();
              }
            }}
          >
            <FileEarmarkPlus/> New Quiz
          </Button>
          <Button
            variant="warning"
            className="me-1"
            onClick={async () => {
              if (confirm("Load a Quiz? \n\nUnsaved changes will be lost!")) {
                const filePath = await window.electron.ipcRenderer.invoke('open-file-dialog');
                const fileContent = await window.electron.ipcRenderer.invoke('read-file', filePath);
                loadQuizData(fileContent);
              }
            }}
          >
            <Upload className="me-1"/>Load Quiz
          </Button>
          <SplitButton
            title={<><Floppy className="me-1" /> Save Quiz</>}
            variant="success"
            drop="down-centered"
            onClick={() => alert("Quiz {quizName_quizDate} saved successfully!")}>
           <Dropdown.Item
           onClick={() => alert("Quiz {quizName_quizDate} saved successfully!")}
           >
            <Floppy className="me-1" />Save as...
            </Dropdown.Item> 
          </SplitButton>
        </>
      ) : (
        <Button
          variant="danger"
          className="me-1"
          onClick={() => {
            if (confirm("Run the quiz?")) {
              window.electron.ipcRenderer.invoke('open-screen')
            } else {
              alert("Quiz {quizName_quizDate} cancelled!");
            }
          }}
        >
          <PlayFill className="me-1"/>
          <strong>RUN QUIZ</strong>
        </Button>
      )}
    </div>
  );
};

export default ActionBar;
