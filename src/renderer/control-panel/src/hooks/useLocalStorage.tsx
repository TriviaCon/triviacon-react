import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  useEffect(() => {
    const handleStorage = () => {
      try {
        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialValue)
      } catch (error) {
        setStoredValue(initialValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener(`${key}-updated`, handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(`${key}-updated`, handleStorage)
    }
  }, [key, initialValue])

  const setValue = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      setStoredValue(value)
      window.dispatchEvent(new Event(`${key}-updated`))
    } catch (error) {
      // handle error
    }
  }

  return [storedValue, setValue] as const
}

// Usage for teams:
// const [teams, setTeams] = useLocalStorage<Team[]>('teams', []);
// This will now update in all windows/tabs and all components using this hook.
