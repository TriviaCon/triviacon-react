import { ipc } from '@renderer/main'
import { Question } from '@renderer/types'
import keys from '@renderer/utils/keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateQuestionMutation = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (q: Partial<Question>) => ipc.db.questions.update(id, q),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.question(id) })
  })
}
