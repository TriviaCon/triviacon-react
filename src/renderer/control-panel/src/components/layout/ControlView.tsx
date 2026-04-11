import { useState } from 'react'
import { Pencil, Play } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import ActionBar from './ActionBar'
import { BuilderView } from '../builder/BuilderView'
import { RunnerView } from '../runner/RunnerView'

const ControlView = () => {
  const [activeTab, setActiveTab] = useState('builder')

  return (
    <div className="flex flex-col">
      <Tabs defaultValue="builder" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">
            <Pencil className="mr-1 h-4 w-4" /> Builder
          </TabsTrigger>
          <TabsTrigger value="game-runner">
            <Play className="mr-1 h-4 w-4" /> Game Runner
          </TabsTrigger>
        </TabsList>
        <ActionBar activeTab={activeTab} />
        <TabsContent value="builder">
          <BuilderView />
        </TabsContent>
        <TabsContent value="game-runner">
          <RunnerView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ControlView
