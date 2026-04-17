import { useState, useEffect } from 'react'
import type { GameState } from '@shared/types/state'
import { INITIAL_GAME_STATE } from '@shared/types/state'

/** Module-level cache so state survives component remounts. */
let cachedState: GameState = INITIAL_GAME_STATE

export function useGameState(): GameState {
  const [state, setState] = useState<GameState>(cachedState)

  useEffect(() => {
    const cleanup = window.api.onStateUpdate((newState) => {
      cachedState = newState
      setState(newState)
    })
    return cleanup
  }, [])

  return state
}
