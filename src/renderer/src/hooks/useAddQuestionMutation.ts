import { ipc } from '@renderer/main'
import { useMutation } from '@tanstack/react-query'

export const useAddQuestionMutation = (categoryId: number) =>
  useMutation({
    mutationFn: () => ipc.db.questions.create({ categoryId })
  })
