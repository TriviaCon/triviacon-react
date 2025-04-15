export default {
  categories: () => ['categories'],
  questions: (categoryId: number) => ['questions', categoryId],
  question: (questionId: number) => ['question', questionId]
}
