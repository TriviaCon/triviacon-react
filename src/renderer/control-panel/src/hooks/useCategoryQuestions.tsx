import { queryOptions, useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const questionsQuery = (categoryId: number) =>
  queryOptions({
    queryKey: keys.questions(categoryId),
    queryFn: () => window.api.questionsByCategory(categoryId)
  })

const useCategoryQuestions = (categoryId: number) => {
  return useQuery(questionsQuery(categoryId))
}

export default useCategoryQuestions
