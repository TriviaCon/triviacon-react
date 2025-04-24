import { ipc } from '@renderer/main'
import { queryOptions, useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const questionsQuery = (categoryId: number) =>
  queryOptions({
    queryKey: keys.questions(categoryId),
    queryFn: () => ipc.db.questions.allByCategoryId(categoryId)
  })

const useCategoryQuestions = (categoryId: number) => {
  return useQuery(questionsQuery(categoryId))
}

export default useCategoryQuestions
