import { ExternalLink, Bug } from 'lucide-react'
import Logo from './layout/Logo'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'

interface CreditsModalProps {
  show: boolean
  onHide: () => void
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ show, onHide }) => {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Logo />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p>
            Version <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">0.9.0</kbd>
          </p>
          <p>Developed by TriviaCon Team:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>alucard87pl (idea, main code)</li>
            <li>Matrix89 (React guru, code cleanup)</li>
            <li>extensive list of beta testers</li>
          </ul>
          <p>Built using:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <a
                href="#"
                className="text-primary underline"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://www.electronjs.org/', '_blank')
                }}
              >
                ElectronJS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary underline"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://react.dev/', '_blank')
                }}
              >
                ReactJS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary underline"
                onClick={(e) => {
                  e.preventDefault()
                  window.open('https://tailwindcss.com/', '_blank')
                }}
              >
                Tailwind CSS
              </a>
            </li>
          </ul>
          <p>Licensed under the MIT License.</p>
          <p className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a
              href="#"
              className="text-primary underline"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://github.com/TriviaCon/triviacon', '_blank')
              }}
            >
              view the source on GitHub
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            <a
              href="#"
              className="text-primary underline"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://github.com/TriviaCon/triviacon/issues', '_blank')
              }}
            >
              report an issue
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
