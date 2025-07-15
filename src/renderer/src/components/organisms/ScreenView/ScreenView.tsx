import React, { useEffect, useState } from 'react';
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
  const [currentView, setCurrentView] = useState<RuntimeState['screen']>('start');

  useEffect(() => {
    // Listen for the IPC event
    window.electron.ipcRenderer.on('set-quiz-view', (view) => {
      console.log('ScreenView received set-quiz-view:', view)
      setCurrentView(view);
    });

    // Optionally: cleanup
    return () => {
      window.electron.ipcRenderer.removeAllListeners('set-quiz-view');
    };
  }, []);

  // Use currentView to select the component to render
  const Component = viewComponents[currentView];
  console.log('ScreenView currentView:', currentView);

  return (
    <Card className="flex-grow-1 d-flex flex-column">
      <Card.Body className="flex-grow-1 d-flex flex-column">
        {Component ? <Component /> : <div>Unknown view: {currentView}</div>}
      </Card.Body>
    </Card>
  );
};

export default ScreenView
