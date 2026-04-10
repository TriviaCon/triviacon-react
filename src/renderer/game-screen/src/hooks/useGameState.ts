import { useState, useEffect } from 'react'
import type { GameState } from '@shared/types/state'
import { GamePhase } from '@shared/types/state'

const initialState: GameState = {
  phase: GamePhase.Idle,
  teams: [],
  currentTeamId: null,
  currentCategoryId: null,
  activeQuestion: null,
  revealedAnswers: [],
  usedQuestions: [],
  quizMeta: null,
  quizFilePath: null,
  categories: []
}

export function useGameState(): GameState {
  const [state, setState] = useState<GameState>(initialState)

  useEffect(() => {
    const cleanup = window.api.onStateUpdate((newState) => {
      setState(newState)
    })
    return cleanup
  }, [])

  return state
}
