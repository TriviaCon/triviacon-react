import React from 'react'
import { useLocalStorage } from '../../../hooks/useLocalStorage'

interface Team {
  id: number;
  name: string;
  score: number;
}

const RankingView: React.FC = () => {
  const [teams] = useLocalStorage<Team[]>('teams', []);
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>RANKING</h1>
      <hr />
      {sortedTeams.length === 0 ? (
        <div>No teams in ranking.</div>
      ) : (
        sortedTeams.map((team, index) => {
          const HeadingTag = `h${Math.min(index + 3, 6)}` as keyof JSX.IntrinsicElements
          return (
            <HeadingTag key={team.id}>
              {index + 1}. {team.name}: {team.score} points
            </HeadingTag>
          )
        })
      )}
    </div>
  )
}

export default RankingView
