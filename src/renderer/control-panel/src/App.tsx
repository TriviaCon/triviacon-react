import Header from './components/layout/Header'
import ControlView from './components/layout/ControlView'
import { MutationCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey
    }
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidateQueries
        })
      }
    }
  })
})

function App() {
  return (
    <div className="px-1 py-1 flex flex-col h-full">
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="flex-grow flex flex-col">
          <ControlView />
        </div>
      </QueryClientProvider>
    </div>
  )
}

export default App
