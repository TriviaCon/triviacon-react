import type { Category, Question } from '@shared/types/quiz'

const QuestionsScreen = ({
  categories,
  currentCategoryId,
  questions,
  usedQuestions
}: {
  categories: Category[]
  currentCategoryId: number | null
  questions: Question[]
  usedQuestions: number[]
}) => {
  const category = categories.find((c) => c.id === currentCategoryId)

  return (
    <div className="w-full py-8 px-6">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold">{category?.name ?? 'Questions'}</h1>
        <hr className="border-border mt-4" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 justify-items-center">
        {questions.map((q, index) => {
          const used = usedQuestions.includes(q.id)
          return (
            <div
              key={q.id}
              className={`w-full rounded-lg border p-4 text-center text-2xl font-bold transition-colors ${
                used
                  ? 'border-border/50 bg-muted/30 text-muted-foreground line-through'
                  : 'border-border bg-card text-card-foreground'
              }`}
            >
              {index + 1}
            </div>
          )
        })}
        {questions.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No questions in this category.
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionsScreen
