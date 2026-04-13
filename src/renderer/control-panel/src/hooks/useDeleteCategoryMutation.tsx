import { useMutation } from '@tanstack/react-query'

export const useDeleteCategoryMutation = (categoryId: number) => {
  return useMutation({
    mutationFn: () => window.api.categoryRemove(categoryId)
  })
}
