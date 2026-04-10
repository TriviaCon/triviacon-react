import { queryOptions, useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const questionQuery = (id: number) =>
  queryOptions({
    queryKey: keys.question(id),
    queryFn: () => window.api.questionById(id)
  })

export const useQuestion = (id: number) => useQuery(questionQuery(id))
