import type { QuizMeta } from '@shared/types/quiz'

const IdleScreen = ({ quizMeta }: { quizMeta: QuizMeta | null }) => {
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
        <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>
          {quizMeta?.name || 'TriviaCON'}
        </h1>
        {quizMeta?.location && <h2 style={{ fontSize: '3rem' }}>{quizMeta.location}</h2>}
        {quizMeta?.date && <h3 style={{ fontSize: '2rem', opacity: 0.7 }}>{quizMeta.date}</h3>}
        {quizMeta?.author && (
          <p style={{ fontSize: '1.5rem', opacity: 0.5 }}>by {quizMeta.author}</p>
        )}
        {!quizMeta && (
          <p style={{ fontSize: '1.25rem', opacity: 0.7 }}>Waiting for game data...</p>
        )}
      </div>
    </div>
  )
}

export default IdleScreen
