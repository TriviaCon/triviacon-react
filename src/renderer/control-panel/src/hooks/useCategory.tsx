import keys from '@renderer/utils/keys'
import { queryOptions } from '@tanstack/react-query'

export const categoryQuery = (id: number) =>
  queryOptions({
    queryKey: keys.category(id),
    queryFn: () => window.api.categoryById(id)
  })
