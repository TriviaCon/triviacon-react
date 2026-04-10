import { useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const useStats = () =>
  useQuery({
    queryKey: keys.stats(),
    queryFn: () => window.api.quizStats()
  })
