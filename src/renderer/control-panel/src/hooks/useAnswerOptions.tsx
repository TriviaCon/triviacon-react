import { queryOptions, useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const answerOptionsQuery = (questionId: number) =>
  queryOptions({
    queryKey: keys.answerOptions(questionId),
    queryFn: () => window.api.answerOptionsByQuestion(questionId)
  })

export const useAnswerOptions = (questionId: number) => useQuery(answerOptionsQuery(questionId))
