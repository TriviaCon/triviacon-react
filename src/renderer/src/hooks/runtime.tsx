import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { Category, Hint, Question } from '@renderer/types'

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
    hints: Hint[]
    answerRevealed: boolean
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
export const RevealedAnswersStorageKey = 'revealedAnswers'
export const RevealedHintsStorageKey = 'revealedHints'
export const UsedQuestionsStorageKey = 'usedQuestions'

export const useRuntimeControls = () => {
  const [revealedAnswers, setRevealedAnswers] = useLocalStorage<number[]>(
    RevealedAnswersStorageKey,
    []
  )
  const [revealedHints, setRevealedHints] = useLocalStorage<number[]>(RevealedHintsStorageKey, [])
  const [used, setUsed] = useLocalStorage<number[]>(UsedQuestionsStorageKey, [])
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
    if (newState.screen === 'question') {
      setRuntimeState({
        screen: 'question',
        data: {
          ...newState.data,
          answerRevealed: revealedAnswers.includes(newState.data.question.id)
        }
      })
    } else {
      setRuntimeState(newState)
    }
  }

  const toggleAnswer = (questionId: number) => {
    if (revealedAnswers.includes(questionId)) {
      setRevealedAnswers(revealedAnswers.filter((id) => id !== questionId))
    } else {
      setRevealedAnswers([...revealedAnswers, questionId])
    }
  }
  const toggleHints = (questionId: number) => {
    if (revealedHints.includes(questionId)) {
      setRevealedHints(revealedHints.filter((id) => id !== questionId))
    } else {
      setRevealedHints([...revealedHints, questionId])
    }
  }
  const toggleUsed = (questionId: number) => {
    if (used.includes(questionId)) {
      setUsed(used.filter((id) => id !== questionId))
    } else {
      setUsed([...used, questionId])
    }
  }

  return {
    transition,
    toggleAnswer,
    toggleHints,
    toggleUsed,
    revealedAnswers,
    revealedHints,
    used
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
