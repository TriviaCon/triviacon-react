export default {
  stats: () => ['stats'],
  questions: (categoryId: number) => ['questions', categoryId],
  question: (questionId: number) => ['question', questionId],
  answerOptions: (questionId: number) => ['answerOptions', questionId],
  meta: () => ['meta']
}
