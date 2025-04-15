import { ipc } from '@renderer/main'
import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddCategoryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ipc.db.categories.create,
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: keys.categories()
      })
  })
}
