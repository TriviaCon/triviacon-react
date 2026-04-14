import { FilePlus, Upload, Save, Play, LayoutGrid, Trophy, Maximize } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'

interface ActionBarProps {
  activeTab: string
}

const ActionBar: React.FC<ActionBarProps> = ({ activeTab }) => {
  return (
    <div className="flex gap-1 mb-2 pb-2 border-b border-border">
      {activeTab === 'builder' ? (
        <>
          <Button
            onClick={async () => {
              if (confirm('Create a new, empty Quiz? \n\nUnsaved changes will be lost!')) {
                await window.api.fileNew()
              }
            }}
          >
            <FilePlus className="mr-1 h-4 w-4" /> New Quiz
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              if (confirm('Load a Quiz? \n\nUnsaved changes will be lost!')) {
                await window.api.fileOpen()
              }
            }}
          >
            <Upload className="mr-1 h-4 w-4" /> Load Quiz
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-green-600 border-green-600/50 hover:bg-green-600/10"
              >
                <Save className="mr-1 h-4 w-4" /> Save Quiz
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => window.api.fileSave()}>
                <Save className="mr-2 h-4 w-4" /> Save
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.api.fileSaveAs()}>
                <Save className="mr-2 h-4 w-4" /> Save as...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button variant="destructive" onClick={() => window.api.openGameScreen()}>
            <Play className="mr-1 h-4 w-4" />
            <strong>RUN QUIZ</strong>
          </Button>
          <Separator orientation="vertical" className="mx-1 h-8" />
          <Button variant="outline" onClick={() => window.api.showCategories()}>
            <LayoutGrid className="mr-1 h-4 w-4" /> Categories
          </Button>
          <Button variant="outline" onClick={() => window.api.showRanking()}>
            <Trophy className="mr-1 h-4 w-4" /> Ranking
          </Button>
          <Separator orientation="vertical" className="mx-1 h-8" />
          <Button variant="outline" onClick={() => window.api.toggleGameFullscreen()}>
            <Maximize className="mr-1 h-4 w-4" /> Fullscreen
          </Button>
        </>
      )}
    </div>
  )
}

export default ActionBar
