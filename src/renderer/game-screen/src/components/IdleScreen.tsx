import type { QuizMeta } from '@shared/types/quiz'

const IdleScreen = ({ quizMeta }: { quizMeta: QuizMeta | null }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-[5rem] mb-4 font-bold">{quizMeta?.name || 'TriviaCON'}</h1>
        {quizMeta?.location && <h2 className="text-[3rem]">{quizMeta.location}</h2>}
        {quizMeta?.date && <h3 className="text-[2rem] opacity-70">{quizMeta.date}</h3>}
        {quizMeta?.author && <p className="text-2xl opacity-50">by {quizMeta.author}</p>}
        {!quizMeta && <p className="text-xl opacity-70">Waiting for game data...</p>}
      </div>
    </div>
  )
}

export default IdleScreen
