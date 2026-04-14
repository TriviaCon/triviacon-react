import { useState } from 'react'
import { CircleHelp, X } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import Logo from './Logo'
import DebugMenu from '../DebugMenu'
import { CreditsModal } from '../CreditsModal'

const Header = () => {
  const [showCredits, setShowCredits] = useState(false)

  return (
    <div className="w-full pb-1">
      <nav className="mb-1 px-3 bg-card border-b border-border rounded flex items-center justify-between draggable">
        <Logo bg="transparent" />
        <div className="nodrag flex items-center gap-1">
          <DebugMenu />
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowCredits(true)}
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 text-destructive border-destructive/50 hover:bg-destructive/10"
            onClick={() => window.api.closeWindow()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </nav>
      <CreditsModal show={showCredits} onHide={() => setShowCredits(false)} />
    </div>
  )
}

export default Header
