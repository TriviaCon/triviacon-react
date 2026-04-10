import { useMutation } from '@tanstack/react-query'

export const useAddQuestionMutation = (categoryId: number) =>
  useMutation({
    mutationFn: () =>
      window.api.questionCreate({ categoryId, type: 'single-answer', text: '', media: null })
  })
