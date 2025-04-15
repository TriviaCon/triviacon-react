import { ipc } from '@renderer/main'
import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteCategoryMutation = (categoryId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => ipc.db.categories.remove(categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.categories() })
  })
}
