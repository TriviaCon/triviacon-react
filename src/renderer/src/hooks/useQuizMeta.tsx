import { ipc } from '@renderer/main'
import { useMutation, useQuery } from '@tanstack/react-query'
import keys from '@renderer/utils/keys'

export const useQuizMeta = () =>
  useQuery({
    queryKey: keys.meta(),
    queryFn: ipc.db.meta.get
  })

const createMetaMutation = (fn: (v: string) => Promise<void>) =>
  useMutation({
    mutationFn: (v: string) => fn(v),
    meta: {
      invalidateQueries: keys.meta()
    }
  })
export const useUpdateName = () => createMetaMutation(ipc.db.meta.updateName)
export const useUpdateAuthor = () => createMetaMutation(ipc.db.meta.updateAuthor)
export const useUpdateDate = () => createMetaMutation(ipc.db.meta.updateDate)
export const useUpdateLocation = () => createMetaMutation(ipc.db.meta.updateLocation)
