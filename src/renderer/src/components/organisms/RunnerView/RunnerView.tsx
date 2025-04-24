import { Row, Col, Container } from 'react-bootstrap'
import ScreenControls from './ScreenControls'
import TeamTable from '../TeamTable/TeamTable'
import QuizTree from '../QuizTree/QuizTree'
import { useCategories } from '../../../hooks/useCategories'
import { useRuntimeControls } from '@renderer/hooks/runtime'
import { useQueryClient } from '@tanstack/react-query'
import { questionsQuery } from '@renderer/hooks/useCategoryQuestions'
import { categoryQuery } from '@renderer/hooks/useCategory'
import { questionQuery } from '@renderer/hooks/useQuestion'

export const RunnerView = () => {
  const queryClient = useQueryClient()
  const { transition } = useRuntimeControls()
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

    const question = await queryClient.fetchQuery(questionQuery(id))

    transition({
      screen: 'question',
      data: { question }
    })
  }

  return (
    <Container fluid className="d-flex flex-column">
      <Row>
        <ScreenControls />
      </Row>
      <Row className="flex-grow-1">
        <Col xs={4} className="border-end">
          <TeamTable />
        </Col>
        <Col className="border-start d-flex flex-column">
          <Row className="flex-grow-1">
            <Col xs={4}>
              <QuizTree
                categories={categories.data}
                setSelectedCategory={handleCategoryClicked}
                setSelectedQuestion={handleQuestionClicked}
                editable={false}
              />
            </Col>
            <Col className="border-start">
              {/* <BasicQuestionViewer */}
              {/*   categories={categories} */}
              {/*   selectedCategory={category} */}
              {/*   selectedQuestion={question} */}
              {/*   updateQuestion={updateQuestion} */}
              {/* /> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
