import type { ActiveQuestionState } from '@shared/types/state'

const QuestionScreen = ({ activeQuestion }: { activeQuestion: ActiveQuestionState | null }) => {
  if (!activeQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-3xl text-muted-foreground">No question selected</h2>
      </div>
    )
  }

  const { question, answerOptions, answerRevealed } = activeQuestion
  const correctOptions = answerOptions.filter((opt) => opt.correct)

  return (
    <div className="w-full py-8 px-6">
      <div className="text-center">
        <h1 className="text-5xl mb-6">{question.text}</h1>
        {question.media && (
          <img src={question.media} className="max-w-full h-auto mx-auto mt-2 mb-6" />
        )}

        <h1
          className="text-7xl font-bold mb-6"
          style={{ visibility: answerRevealed ? 'visible' : 'hidden' }}
        >
          {correctOptions.map((o) => o.text).join(', ')}
        </h1>

        {answerOptions.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {answerOptions.map((opt, index) => (
              <div
                key={opt.id}
                className={`rounded-lg p-4 ${
                  answerRevealed && opt.correct
                    ? 'bg-success text-success-foreground'
                    : 'bg-card text-card-foreground border border-border'
                }`}
              >
                <p className="text-4xl">
                  {String.fromCharCode(65 + index)}. {opt.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionScreen
