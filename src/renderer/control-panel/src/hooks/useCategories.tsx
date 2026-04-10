import keys from '@renderer/utils/keys'
import { queryOptions, useQuery } from '@tanstack/react-query'

const categoriesQuery = () =>
  queryOptions({
    queryKey: keys.categories(),
    queryFn: () => window.api.categoriesAll()
  })

export const useCategories = () => useQuery(categoriesQuery())
