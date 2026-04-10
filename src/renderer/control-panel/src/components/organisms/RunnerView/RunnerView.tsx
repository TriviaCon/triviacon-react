import { Row, Col, Container } from 'react-bootstrap'
import TeamTable from '../TeamTable/TeamTable'
import QuizTree from '../QuizTree/QuizTree'
import { useCategories } from '../../../hooks/useCategories'
import { useGameState } from '@renderer/hooks/useGameState'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import BasicQuestionViewer from '../QuestionView/BasicQuestionViewer'
import { useState } from 'react'

const QuestionColumn = ({ id }: { id: number }) => {
  const gameState = useGameState()
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)

  if (!question.data || !answerOptions.data) {
    return
  }

  return (
    <BasicQuestionViewer
      question={question.data}
      answerOptions={answerOptions.data}
      answerRevealed={gameState.revealedAnswers.includes(id)}
      onRevealAnswer={() => window.api.toggleAnswer(id)}
      used={gameState.usedQuestions.includes(id)}
      onUse={() => window.api.markUsed(id)}
    />
  )
}

export const RunnerView = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const categories = useCategories()

  if (!categories.data) {
    return
  }

  const handleCategoryClicked = (id: number | null) => {
    if (!id) return
    setSelectedQuestionId(null)
    window.api.showQuestions(id)
  }

  const handleQuestionClicked = (id: number | null) => {
    if (!id) return
    setSelectedQuestionId(id)
    window.api.showQuestion(id)
  }

  return (
    <Container fluid className="h-100">
      <Row>
        <Col sm={4} md={3} className="border-end">
          <TeamTable />
        </Col>
        <Col className="border-start d-flex flex-column">
          <Row>
            <Col xs={4}>
              <QuizTree
                categories={categories.data}
                setSelectedCategory={handleCategoryClicked}
                setSelectedQuestion={handleQuestionClicked}
                editable={false}
              />
            </Col>
            <Col>{selectedQuestionId && <QuestionColumn id={selectedQuestionId} />}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
