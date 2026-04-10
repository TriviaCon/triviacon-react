import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteAnswerOptionMutation = (questionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => window.api.answerOptionRemove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.answerOptions(questionId) })
  })
}
