import { ipc } from '@renderer/main'
import keys from '@renderer/utils/keys'
import { useQuery } from '@tanstack/react-query'

export const useCategories = () =>
  useQuery({
    queryKey: keys.categories(),
    queryFn: () => ipc.db.categories.all()
  })
