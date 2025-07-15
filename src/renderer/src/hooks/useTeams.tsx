import { useEffect, useState, useCallback } from 'react';

export type Team = {
  id: number;
  name: string;
  score: number;
};

const TEAMS_KEY = 'teams';

export function useTeams() {
  const [teams, setTeamsState] = useState<Team[]>(() =>
    JSON.parse(localStorage.getItem(TEAMS_KEY) || '[]')
  );

  // Update state when localStorage changes (from this or other windows)
  useEffect(() => {
    const handler = () => {
      setTeamsState(JSON.parse(localStorage.getItem(TEAMS_KEY) || '[]'));
    };
    window.addEventListener('teams-updated', handler);
    window.addEventListener('storage', handler); // for cross-tab sync
    return () => {
      window.removeEventListener('teams-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Write to localStorage and notify listeners
  const setTeams = useCallback((newTeams: Team[]) => {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(newTeams));
    setTeamsState(newTeams);
    window.dispatchEvent(new Event('teams-updated'));
  }, []);

  return [teams, setTeams] as const;
}
