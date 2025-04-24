import { ipc } from '@renderer/main'
import keys from '@renderer/utils/keys'
import { queryOptions, useQuery } from '@tanstack/react-query'

const categoriesQuery = () =>
  queryOptions({
    queryKey: keys.categories(),
    queryFn: () => ipc.db.categories.all()
  })

export const useCategories = () => useQuery(categoriesQuery())
