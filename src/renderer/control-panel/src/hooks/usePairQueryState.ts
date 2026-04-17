import type { UseQueryResult } from '@tanstack/react-query'

type PairQueryState =
  | { ok: true }
  | { ok: false; loading: boolean; errorMessage: string | undefined }

/**
 * Collapses the standard loading/error/no-data guard for two paired queries.
 *
 * Usage:
 *   const guard = usePairQueryState(q1, q2)
 *   if (!guard.ok) {
 *     if (guard.loading) return <QueryLoading />
 *     if (guard.errorMessage) return <QueryError message={guard.errorMessage} />
 *     return null
 *   }
 */
export function usePairQueryState(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  q1: UseQueryResult<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  q2: UseQueryResult<any>
): PairQueryState {
  if (q1.isLoading || q2.isLoading) {
    return { ok: false, loading: true, errorMessage: undefined }
  }
  if (q1.error || q2.error) {
    return {
      ok: false,
      loading: false,
      errorMessage: (q1.error as Error | null)?.message ?? (q2.error as Error | null)?.message
    }
  }
  if (q1.data == null || q2.data == null) {
    return { ok: false, loading: false, errorMessage: undefined }
  }
  return { ok: true }
}
