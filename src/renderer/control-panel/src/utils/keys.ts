export default {
  stats: () => ['stats'],
  category: (id: number) => ['category', id],
  categories: () => ['categories'],
  questions: (categoryId: number) => ['questions', categoryId],
  question: (questionId: number) => ['question', questionId],
  answerOptions: (questionId: number) => ['answerOptions', questionId],
  meta: () => ['meta']
}
