import React from 'react'
import type { Team } from '@shared/types/quiz'

const RankingScreen = ({ teams }: { teams: Team[] }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem' }}>RANKING</h1>
      <hr />
      {sortedTeams.length === 0 ? (
        <div style={{ fontSize: '4rem' }}>No teams in ranking.</div>
      ) : (
        sortedTeams.map((team, index) => {
          let fontSize: string
          if (index === 0) fontSize = '4.5rem'
          else if (index === 1) fontSize = '3.5rem'
          else if (index === 2) fontSize = '2.9rem'
          else fontSize = '1.7rem'

          const HeadingTag = `h${Math.min(index + 3, 6)}` as keyof React.JSX.IntrinsicElements

          let displayText: string
          if (index === 0)
            displayText = `\u{1F947} ${index + 1}. ${team.name}: ${team.score} points \u{1F947}`
          else if (index === 1)
            displayText = `\u{1F948} ${index + 1}. ${team.name}: ${team.score} points \u{1F948}`
          else if (index === 2)
            displayText = `\u{1F949} ${index + 1}. ${team.name}: ${team.score} points \u{1F949}`
          else displayText = `${index + 1}. ${team.name}: ${team.score} points`

          return (
            <React.Fragment key={team.id}>
              <HeadingTag style={{ fontSize, margin: '0.5em 0' }}>{displayText}</HeadingTag>
              {index === 2 && sortedTeams.length > 3 && <div style={{ height: '3.5rem' }} />}
            </React.Fragment>
          )
        })
      )}
    </div>
  )
}

export default RankingScreen
