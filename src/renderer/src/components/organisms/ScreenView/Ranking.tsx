import React from 'react'
import { StateRanking } from '@renderer/hooks/runtime'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx ¯\_(ツ)_/¯ */
const RankingView: React.FC = ({ teams }: StateRanking['data']) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>RANKING</h1>
      <hr />
      {teams
        .sort((a, b) => b.score - a.score)
        .map((team, index) => {
          const HeadingTag = `h${Math.min(index + 3, 6)}` as keyof JSX.IntrinsicElements
          return (
            <HeadingTag key={team.id}>
              {index + 1}. {team.name}: {team.score} points
            </HeadingTag>
          )
        })}
    </div>
  )
}

export default RankingView
