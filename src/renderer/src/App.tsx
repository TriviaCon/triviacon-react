import { useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { CategoriesProvider } from './context/categories'
import Header from './components/molecules/Header'
import { Container, Row } from 'react-bootstrap'
import ScreenView from './components/organisms/ScreenView/ScreenView'
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
  const isScreen = useMemo(
    () => new URLSearchParams(window.location.search).get('screen') === 'true',
    []
  )

  return (
    <Container fluid className="px-1 py-1 d-flex flex-column">
      <QueryClientProvider client={queryClient}>
        <CategoriesProvider>
          <Row>
            <Header isScreen={isScreen} />
          </Row>
          <Row className="flex-grow-1 d-flex flex-column mx-0">
            {isScreen ? <ScreenView /> : <ControlView />}
          </Row>
        </CategoriesProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Container>
  )
}
export default App
