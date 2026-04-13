import { useMutation } from '@tanstack/react-query'

export const useAddCategoryMutation = () => {
  return useMutation({
    mutationFn: (name: string) => window.api.categoryCreate(name)
  })
}
