import React from 'react'
import { Card } from 'react-bootstrap'
import Categories from './Categories'
import SingleQuestionView from './SingleQuestion'
import RankingView from './Ranking'
import StartScreen from './Start'
import Questions from './Questions'
import { RuntimeState, useRuntimeState } from '@renderer/hooks/runtime'

const viewComponents: Record<RuntimeState['screen'], React.FC> = {
  categories: Categories,
  questions: Questions,
  question: SingleQuestionView,
  ranking: RankingView,
  start: StartScreen
}

const ScreenView: React.FC = () => {
  const { screen, data } = useRuntimeState()

  // Use currentView to select the component to render
  const Component = viewComponents[screen]
  console.log('ScreenView currentView:', screen)

  return (
    <Card className="flex-grow-1 d-flex flex-column">
      <Card.Body className="flex-grow-1 d-flex flex-column">
        {Component ? <Component {...data} /> : <div>Unknown view: {screen}</div>}
      </Card.Body>
    </Card>
  )
}

export default ScreenView
