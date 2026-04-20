import { ExternalLink, Bug } from 'lucide-react'
import Logo from './layout/Logo'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
declare const __APP_VERSION__: string

const platformLabel: Record<string, string> = {
  win32: 'Windows',
  linux: 'Linux',
  darwin: 'macOS'
}

function buildIssueUrl(): string {
  const platform = platformLabel[window.api.platform] ?? window.api.platform
  const body = `**Wersja:** ${__APP_VERSION__}\n**System:** ${platform}\n\n<!-- Opisz błąd poniżej -->`
  const params = new URLSearchParams({
    template: 'bug_report.yml',
    title: 'Bug: ',
    labels: 'bug',
    body
  })
  return `https://github.com/TriviaCon/triviacon/issues/new?${params.toString()}`
}

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
            Version <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{__APP_VERSION__}</kbd>
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
                window.open(buildIssueUrl(), '_blank')
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
