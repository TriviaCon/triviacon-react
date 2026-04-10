import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/molecules/Header'
import { Container, Row } from 'react-bootstrap'
import ControlView from './components/organisms/ControlView/ControlView'
import { MutationCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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

function App(): JSX.Element {
  return (
    <Container fluid className="px-1 py-1 d-flex flex-column">
      <QueryClientProvider client={queryClient}>
        <Row>
          <Header isScreen={false} />
        </Row>
        <Row className="flex-grow-1 d-flex flex-column mx-0">
          <ControlView />
        </Row>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Container>
  )
}
export default App
