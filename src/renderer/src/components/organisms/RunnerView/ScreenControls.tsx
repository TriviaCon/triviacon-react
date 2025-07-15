import { Button, Alert } from 'react-bootstrap'
import { useLocalStorage } from '../../../hooks/useLocalStorage'

const ScreenControls = () => {
  const [currentView, setCurrentView] = useLocalStorage('currentView', 'start')

  const setQuizView = (view: string) => {
    console.log('setQuizView called with:', view);
    window.electron.ipcRenderer.invoke('set-quiz-view', view);
    setCurrentView(view); // Optionally keep local state in sync
  };

  return (
    <Alert variant="dark" className="d-inline-block p-1">
      <div className="d-flex align-items-center">
        <h2 className="me-3">Quiz Controls</h2>
        <div className="d-flex">
          <Button
            variant={currentView === 'start' ? 'secondary' : 'outline-secondary'}
            className="me-1"
            onClick={() => setQuizView('start')}
          >
            Start Screen
          </Button>
          <Button
            variant={currentView === 'ranking' ? 'secondary' : 'outline-secondary'}
            className="me-1"
            onClick={() => setQuizView('ranking')}
          >
            Ranking
          </Button>
          <Button
            variant={currentView === 'categories' ? 'secondary' : 'outline-secondary'}
            className="me-1"
            onClick={() => setQuizView('categories')}
          >
            Categories
          </Button>
          <Button
            variant={currentView === 'questions' ? 'secondary' : 'outline-secondary'}
            className="me-1"
            onClick={() => setQuizView('questions')}
          >
            Questions Grid
          </Button>
          <Button
            variant={currentView === 'single' ? 'secondary' : 'outline-secondary'}
            className="me-1"
            onClick={() => setQuizView('question')}
          >
            Question
          </Button>
        </div>
      </div>
    </Alert>
  )
}
export default ScreenControls
