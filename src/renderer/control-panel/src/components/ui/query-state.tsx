import { Loader2, AlertCircle } from 'lucide-react'

export function QueryLoading({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 p-4 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function QueryError({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 p-4 text-destructive">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">{message ?? 'Failed to load data'}</span>
    </div>
  )
}
