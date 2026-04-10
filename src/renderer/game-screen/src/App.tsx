import 'bootstrap/dist/css/bootstrap.min.css'
import { useGameState } from './hooks/useGameState'
import { GamePhase } from '@shared/types/state'
import IdleScreen from './components/IdleScreen'
import CategoriesScreen from './components/CategoriesScreen'
import QuestionsScreen from './components/QuestionsScreen'
import QuestionScreen from './components/QuestionScreen'
import RankingScreen from './components/RankingScreen'

function App(): JSX.Element {
  const gameState = useGameState()

  switch (gameState.phase) {
    case GamePhase.Categories:
      return <CategoriesScreen categories={gameState.categories} />
    case GamePhase.Questions:
      return (
        <QuestionsScreen
          categories={gameState.categories}
          currentCategoryId={gameState.currentCategoryId}
        />
      )
    case GamePhase.Question:
      return <QuestionScreen activeQuestion={gameState.activeQuestion} />
    case GamePhase.Ranking:
      return <RankingScreen teams={gameState.teams} />
    default:
      return <IdleScreen quizMeta={gameState.quizMeta} />
  }
}

export default App
