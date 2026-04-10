import 'bootstrap/dist/css/bootstrap.min.css'

function App(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#e0e0e0'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>TriviaCON</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.7 }}>Waiting for game data...</p>
      </div>
    </div>
  )
}
export default App
