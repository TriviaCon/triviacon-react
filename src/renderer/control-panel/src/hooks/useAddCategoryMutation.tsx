import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddCategoryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => window.api.categoryCreate(name),
    onSuccess: () => qc.refetchQueries({ queryKey: keys.categories() })
  })
}
