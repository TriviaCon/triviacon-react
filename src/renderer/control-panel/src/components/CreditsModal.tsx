import { ExternalLink, Bug } from 'lucide-react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import Logo from './layout/Logo'
import { buildIssueUrl } from '@renderer/utils/issueUrl'
import a87Logo from '../assets/a87logo.png'

declare const __APP_VERSION__: string

const TECH_STACK = [
  { name: 'ElectronJS', url: 'https://www.electronjs.org/' },
  { name: 'ReactJS', url: 'https://react.dev/' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' }
]

interface CreditsModalProps {
  show: boolean
  onHide: () => void
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ show, onHide }) => {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        {/* Header band */}
        <div className="bg-gradient-to-br from-card via-muted/60 to-card px-6 py-5 flex flex-col items-center gap-1 border-b border-border">
          <Logo />
          <kbd className="rounded bg-background/60 border border-border px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
            v{__APP_VERSION__}
          </kbd>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Team */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Developed by
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <img src={a87Logo} alt="alucard87pl" className="h-5 w-auto opacity-90" />
                <span className="text-xs text-muted-foreground">idea, main code</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold leading-none">Matrix89</span>
                <span className="text-xs text-muted-foreground">React guru, code cleanup</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                ...and an extensive list of beta testers
              </p>
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Built with
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map(({ name, url }) => (
                <button
                  key={name}
                  onClick={() => window.open(url, '_blank')}
                  className="text-xs bg-muted hover:bg-muted/70 rounded px-2 py-1 text-foreground transition-colors cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground">MIT License</span>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://github.com/TriviaCon/triviacon', '_blank')
                }}
              >
                <ExternalLink className="h-3 w-3" /> GitHub
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(buildIssueUrl(), '_blank')
                }}
              >
                <Bug className="h-3 w-3" /> Report issue
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
