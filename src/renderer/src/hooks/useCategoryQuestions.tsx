import { ipc } from '@renderer/main'
import { useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

const useCategoryQuestions = (categoryId: number) => {
  return useQuery({
    queryKey: keys.questions(categoryId),
    queryFn: () => ipc.db.questions.allByCategoryId(categoryId)
  })
}

export default useCategoryQuestions
