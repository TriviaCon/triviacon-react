import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAddAnswerOptionMutation = (questionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => window.api.answerOptionCreate(questionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.answerOptions(questionId) })
  })
}
