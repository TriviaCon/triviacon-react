import type { Category } from '@shared/types/quiz'

const QuestionsScreen = ({
  categories,
  currentCategoryId
}: {
  categories: Category[]
  currentCategoryId: number | null
}) => {
  const category = categories.find((c) => c.id === currentCategoryId)

  return (
    <div className="w-full py-8 px-6">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold">{category?.name ?? 'Questions'}</h1>
        <hr className="border-border mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 justify-items-center">
        <div className="w-full rounded-lg border border-border bg-card p-4">
          <p className="text-center text-muted-foreground">
            Questions are displayed from the control panel.
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuestionsScreen
