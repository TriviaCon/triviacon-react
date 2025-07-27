import React from 'react'
import { StateRanking } from '@renderer/hooks/runtime'

const RankingView: React.FC = ({ teams }: StateRanking['data']) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem' }}>RANKING</h1>
      <hr />
      {sortedTeams.length === 0 ? (
        <div style={{ fontSize: '4rem' }}>No teams in ranking.</div>
      ) : (
        <>
          {sortedTeams.map((team, index) => {
            let fontSize
            if (index === 0)
              fontSize = '4.5rem' // 1st place
            else if (index === 1)
              fontSize = '3.5rem' // 2nd place
            else if (index === 2)
              fontSize = '2.9rem' // 3rd place
            else fontSize = '1.7rem' // others
            const HeadingTag = `h${Math.min(index + 3, 6)}` as keyof JSX.IntrinsicElements
            let displayText
            if (index === 0) displayText = `🥇 ${index + 1}. ${team.name}: ${team.score} points 🥇`
            else if (index === 1)
              displayText = `🥈 ${index + 1}. ${team.name}: ${team.score} points 🥈`
            else if (index === 2)
              displayText = `🥉 ${index + 1}. ${team.name}: ${team.score} points 🥉`
            else displayText = `${index + 1}. ${team.name}: ${team.score} points`
            return (
              <React.Fragment key={team.id}>
                <HeadingTag style={{ fontSize, margin: '0.5em 0' }}>{displayText}</HeadingTag>
                {/* Insert spacing after the 3rd team if there are more than 3 teams */}
                {index === 2 && sortedTeams.length > 3 && <div style={{ height: '3.5rem' }} />}
              </React.Fragment>
            )
          })}
        </>
      )}
    </div>
  )
}

export default RankingView
