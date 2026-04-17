import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TeamTable from './TeamTable'
import QuizTree from '../builder/QuizTree'
import { useGameState } from '@renderer/hooks/useGameState'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import BasicQuestionViewer from './BasicQuestionViewer'
import { QueryLoading, QueryError } from '@renderer/components/ui/query-state'
import { usePairQueryState } from '@renderer/hooks/usePairQueryState'

const QuestionColumn = ({ id }: { id: number }) => {
  const { t } = useTranslation()
  const { revealedAnswers, usedQuestions, activeQuestion } = useGameState()
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)

  const guard = usePairQueryState(question, answerOptions)
  if (!guard.ok) {
    if (guard.loading) return <QueryLoading label={t('builder.loadingQuestion')} />
    if (guard.errorMessage) return <QueryError message={guard.errorMessage} />
    return null
  }

  const markedAnswerId =
    activeQuestion?.question.id === id ? (activeQuestion.markedAnswerId ?? null) : null

  return (
    <BasicQuestionViewer
      question={question.data!}
      answerOptions={answerOptions.data!}
      answerRevealed={revealedAnswers.includes(id)}
      onRevealAnswer={() => window.api.toggleAnswer(id)}
      markedAnswerId={markedAnswerId}
      onMarkAnswer={(answerId) => window.api.markAnswer(answerId)}
      used={usedQuestions.includes(id)}
      onUse={() => window.api.markUsed(id)}
    />
  )
}

export const RunnerView = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const { categories, usedQuestions } = useGameState()

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
            usedQuestions={usedQuestions}
          />
        </div>
        <div className="flex-1 pl-3">
          {selectedQuestionId && <QuestionColumn id={selectedQuestionId} />}
        </div>
      </div>
    </div>
  )
}
