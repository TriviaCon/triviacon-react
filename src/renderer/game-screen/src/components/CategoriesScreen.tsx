import type { Category } from '@shared/types/quiz'

const CategoriesScreen = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="w-full py-8 px-6">
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold">CATEGORIES</h1>
        <hr className="border-border mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 justify-items-center">
        {categories.length === 0 ? (
          <div className="text-center col-span-full text-muted-foreground">
            No categories available.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="w-full rounded-lg border border-border bg-card p-4 flex flex-col"
            >
              <h4 className="text-lg font-bold text-center text-card-foreground">
                {category.name}
              </h4>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoriesScreen
