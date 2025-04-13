import { createContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { v4 as uuidv4 } from 'uuid'
import { Uuid } from '@renderer/types'

export type Category = {
  cID: Uuid
  name: string
  questions: Question[]
}

export type Question = {
  qID: Uuid
  text: string
  answer: string
  hints: string[]
  media: string
  used: boolean
  answerRevealed: boolean
  hintsRevealed: boolean
}

export type CategoriesContextType = {
  loadQuizData: (url: string) => Promise<void>
  addCategory: (name: string) => Promise<unknown>
  deleteCategory: (cID: Uuid) => Promise<unknown>
  updateCategory: (cID: Uuid, category: Partial<Category>) => void
  addQuestion: (cID: Uuid) => void
  updateQuestion: (cID: Uuid, qID: string, question: Partial<Question>) => void
  deleteQuestion: (categoryId: Uuid, questionId: Uuid) => void

  categories: Category[]
}

export const CATEGORIES_CONTEXT = createContext<CategoriesContextType>(null!)

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', [])

  const addCategory = async (name: string) => {
    setCategories([
      ...categories,
      {
        cID: uuidv4(),
        name,
        questions: []
      }
    ])
  }

  const addQuestion = (cID: Uuid) => {
    const category = categories.find((category) => category.cID === cID)
    if (!category) {
      return
    }
    const question: Question = {
      qID: uuidv4(),
      text: '',
      answer: '',
      hints: [],
      media: '',
      used: false,
      answerRevealed: false,
      hintsRevealed: false
    }
    setCategories(
      categories.map((c) => (c.cID === cID ? { ...c, questions: [...c.questions, question] } : c))
    )
  }

  const loadQuizData = async (data: string) => {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data

    localStorage.setItem('quizInfo', JSON.stringify(parsedData.quizInfo))

    const processedCategories = parsedData.categories.map((category) => ({
      ...category,
      cID: uuidv4(),
      questions: category.questions.map((question) => ({
        ...question,
        qID: uuidv4(),
        used: false,
        answerRevealed: false,
        hintsRevealed: false
      }))
    }))

    localStorage.setItem('categories', JSON.stringify(processedCategories))
    setCategories(processedCategories)
  }

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category && category.cID === categoryId ? { ...category, ...updates } : category
      )
    )
  }

  const deleteCategory = async (cID: string) => {
    setCategories(categories.filter((c) => c.cID !== cID))
  }

  const updateQuestion = (cID: string, qID: string, updated: Partial<Question>) => {
    setCategories(
      categories.map((c) => {
        if (c.cID !== cID) {
          return c
        }
        return {
          ...c,
          questions: c.questions.map((q) => {
            if (q.qID !== qID) {
              return q
            }
            return Object.fromEntries(
              Object.entries(q).map(([key, value]) => [key, updated[key] ?? value])
            ) as Question
          })
        }
      })
    )
  }

  const deleteQuestion = (categoryId: Uuid, questionId: Uuid) => {
    setCategories(
      categories.map((c) =>
        c.cID === categoryId
          ? {
              ...c,
              questions: c.questions.filter((q) => q.qID !== questionId)
            }
          : c
      )
    )
  }

  return (
    <CATEGORIES_CONTEXT.Provider
      value={{
        loadQuizData: loadQuizData,
        addCategory: addCategory,
        deleteCategory: deleteCategory,
        updateCategory: updateCategory,
        addQuestion: addQuestion,
        updateQuestion: updateQuestion,
        deleteQuestion: deleteQuestion,
        categories
      }}
    >
      {children}
    </CATEGORIES_CONTEXT.Provider>
  )
}
