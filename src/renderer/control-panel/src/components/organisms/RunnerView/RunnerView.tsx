import { Row, Col, Container } from 'react-bootstrap'
import TeamTable from '../TeamTable/TeamTable'
import QuizTree from '../QuizTree/QuizTree'
import { useCategories } from '../../../hooks/useCategories'
import { useRuntimeControls } from '@renderer/hooks/runtime'
import { useQueryClient } from '@tanstack/react-query'
import { questionsQuery } from '@renderer/hooks/useCategoryQuestions'
import { categoryQuery } from '@renderer/hooks/useCategory'
import { questionQuery, useQuestion } from '@renderer/hooks/useQuestion'
import { answerOptionsQuery, useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import BasicQuestionViewer from '../QuestionView/BasicQuestionViewer'
import { useState } from 'react'

const QuestionColumn = ({ id }: { id: number }) => {
  const { toggleAnswer, toggleUsed, revealedAnswers, used } = useRuntimeControls()
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)

  if (!question.data || !answerOptions.data) {
    return
  }

  return (
    <BasicQuestionViewer
      question={question.data}
      answerOptions={answerOptions.data}
      answerRevealed={revealedAnswers.includes(id)}
      onRevealAnswer={() => toggleAnswer(id)}
      used={used.includes(id)}
      onUse={() => toggleUsed(id)}
    />
  )
}

export const RunnerView = () => {
  const queryClient = useQueryClient()
  const { transition } = useRuntimeControls()
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
  const categories = useCategories()

  if (!categories.data) {
    return
  }

  const handleCategoryClicked = async (id: number | null) => {
    if (!id) {
      return
    }

    const [category, questions] = await Promise.all([
      queryClient.fetchQuery(categoryQuery(id)),
      queryClient.fetchQuery(questionsQuery(id))
    ])

    if (!category) {
      throw new Error(`Category ${id} not found`)
    }

    setSelectedQuestionId(null)
    transition({
      screen: 'questions',
      data: {
        category,
        questions
      }
    })
  }

  const handleQuestionClicked = async (id: number | null) => {
    if (!id) {
      return
    }

    const [question, answerOptions] = await Promise.all([
      queryClient.fetchQuery(questionQuery(id)),
      queryClient.fetchQuery(answerOptionsQuery(id))
    ])

    setSelectedQuestionId(id)
    transition({
      screen: 'question',
      data: { question: question!, answerOptions: answerOptions ?? [], answerRevealed: true }
    })
  }

  return (
    <Container fluid className="h-100">
      {/* <Row> */}
      {/*   <ScreenControls /> */}
      {/* </Row> */}
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
