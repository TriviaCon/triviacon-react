import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { Category, Question } from '@renderer/types'

export type StateStart = {
  screen: 'start'
  data: {
    name: string
    location: string
    date: string
    author: string
  }
}

export type StateCategories = {
  screen: 'categories'
  data: {
    categories: Category[]
  }
}

export type StateQuestions = {
  screen: 'questions'
  data: {
    category: Category
    questions: Question[]
  }
}

export type StateQuestion = {
  screen: 'question'
  data: {
    question: Question
  }
}

export type StateRanking = {
  screen: 'ranking'
  data: {
    teams: {
      id: number
      score: number
      name: string
    }[]
  }
}

export type RuntimeState =
  | StateStart
  | StateCategories
  | StateQuestions
  | StateQuestion
  | StateRanking

const RuntimeStateStorageKey = 'runtimeState'

export const useRuntimeControls = () => {
  const [, setRuntimeState] = useLocalStorage<RuntimeState>(RuntimeStateStorageKey, {
    screen: 'start',
    data: {
      name: '',
      location: '',
      date: '',
      author: ''
    }
  })

  const transition = (newState: RuntimeState) => {
    setRuntimeState(newState)
  }

  return {
    transition
  }
}

export const useRuntimeState = () => {
  const [runtimeState] = useLocalStorage<RuntimeState>(RuntimeStateStorageKey, {
    screen: 'start',
    data: {
      name: '',
      location: '',
      date: '',
      author: ''
    }
  })
  return runtimeState
}
