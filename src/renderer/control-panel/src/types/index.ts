export type Uuid = string

export type QuestionType = 'multiple-choice' | 'single-answer' | 'list'

export type Category = {
  id: number
  name: string
}

export type Question = {
  id: number
  categoryId: number
  type: QuestionType
  text: string
  media: string | null
}

export interface AnswerOption {
  id: number
  questionId: number
  text: string
  correct: boolean
  sortOrder: number
}

export type Stats = {
  totalQuestions: number
  questionsWithMedia: number
}

export type QuizMeta = {
  location: string
  author: string
  name: string
  date: string
  splash: string
}
