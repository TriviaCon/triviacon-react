import { useMemo, useSyncExternalStore } from 'react'

const getOrInitData = <T,>(key: string, initialValue: T) => {
  const data = localStorage.getItem(key)
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }
  return JSON.parse(data) as T
}

const syncedLocalStorage = <T,>(key: string, initialValue: T) => {
  let data = getOrInitData(key, initialValue)
  let localCallback: (() => void) | null = null

  const getSnapshot = () => data

  const subscribe = (callback: () => void) => {
    localCallback = callback
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return
      }

      const newData = getOrInitData(key, initialValue)
      if (newData !== data) {
        data = newData
        callback()
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }

  const setState = (value: T | ((prev: T) => T)) => {
    const val = value instanceof Function ? value(data) : value
    localStorage.setItem(key, JSON.stringify(val))
    if (localCallback) {
      data = val
      localCallback()
    }
  }

  return { subscribe, getSnapshot, setState }
}

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const { subscribe, getSnapshot, setState } = useMemo(
    () => syncedLocalStorage(key, initialValue),
    []
  )

  const state = useSyncExternalStore(subscribe, getSnapshot)

  return [state, setState] as const
}
