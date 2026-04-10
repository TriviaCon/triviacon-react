import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateAnswerOptionMutation = (questionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, text, correct }: { id: number; text?: string; correct?: boolean }) =>
      window.api.answerOptionUpdate(id, { text, correct }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.answerOptions(questionId) })
  })
}
