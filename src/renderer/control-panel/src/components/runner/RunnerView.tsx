import { useState } from 'react'
import TeamTable from './TeamTable'
import QuizTree from '../builder/QuizTree'
import { useGameState } from '@renderer/hooks/useGameState'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import BasicQuestionViewer from './BasicQuestionViewer'
import { QueryLoading, QueryError } from '@renderer/components/ui/query-state'

const QuestionColumn = ({ id }: { id: number }) => {
  const { revealedAnswers, usedQuestions } = useGameState()
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)

  if (question.isLoading || answerOptions.isLoading) {
    return <QueryLoading label="Loading question..." />
  }
  if (question.error || answerOptions.error) {
    return <QueryError message={question.error?.message ?? answerOptions.error?.message} />
  }
  if (!question.data || !answerOptions.data) return null

  return (
    <BasicQuestionViewer
      question={question.data}
      answerOptions={answerOptions.data}
      answerRevealed={revealedAnswers.includes(id)}
      onRevealAnswer={() => window.api.toggleAnswer(id)}
      used={usedQuestions.includes(id)}
      onUse={() => window.api.markUsed(id)}
    />
  )
}

export const RunnerView = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const { categories } = useGameState()

  if (!categories.length) return null

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
    <div className="w-full h-full flex">
      <div className="w-1/4 min-w-[240px] border-r border-border pr-3">
        <TeamTable />
      </div>
      <div className="flex-1 pl-3 flex">
        <div className="w-1/3 min-w-[200px]">
          <QuizTree
            categories={categories}
            setSelectedCategory={handleCategoryClicked}
            setSelectedQuestion={handleQuestionClicked}
            editable={false}
          />
        </div>
        <div className="flex-1 pl-3">
          {selectedQuestionId && <QuestionColumn id={selectedQuestionId} />}
        </div>
      </div>
    </div>
  )
}
