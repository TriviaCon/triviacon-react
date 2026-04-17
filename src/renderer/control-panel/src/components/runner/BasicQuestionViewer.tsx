import { useTranslation } from 'react-i18next'
import { AnswerOption, Question } from '@shared/types/quiz'
import { Label } from '@renderer/components/ui/label'
import { MediaPreview } from '@renderer/components/ui/media-preview'
import { cn } from '@renderer/lib/utils'
import { mediaUrl } from '@shared/mediaUrl'

const BasicQuestionViewer = ({
  question,
  answerOptions,
  answerRevealed,
  onRevealAnswer,
  markedAnswerId,
  onMarkAnswer,
  used,
  onUse
}: {
  question: Question
  answerOptions: AnswerOption[]
  answerRevealed: boolean
  onRevealAnswer: () => void
  markedAnswerId: number | null
  onMarkAnswer: (id: number | null) => void
  used: boolean
  onUse: () => void
}) => {
  const { t } = useTranslation()
  const mediaSrc = mediaUrl(question.media)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{question.text}</h2>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-start">
        <span className="font-semibold text-sm text-right">{t('runner.media')}</span>
        <div>
          {!mediaSrc ? (
            <span className="text-sm text-muted-foreground">{t('runner.noMedia')}</span>
          ) : (
            <div className="rounded-lg border border-border p-3 space-y-2">
              <MediaPreview media={question.media} fullscreenButton playbackControls />
            </div>
          )}
        </div>

        <span className="font-semibold text-sm text-right pt-1">{t('runner.answers')}</span>
        <div className="space-y-1.5">
          {answerOptions.length > 0 ? (
            answerOptions.map((opt, index) => {
              const isMarked = opt.id === markedAnswerId
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onMarkAnswer(isMarked ? null : opt.id)}
                  className={cn(
                    'w-full text-left rounded-md px-3 py-2 text-sm border cursor-pointer transition-colors',
                    answerRevealed && opt.correct
                      ? 'bg-green-100 border-green-300 text-green-900'
                      : answerRevealed && isMarked && !opt.correct
                        ? 'bg-red-100 border-red-300 text-red-900'
                        : isMarked
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : opt.correct
                            ? 'bg-muted/50 border-green-400/50 hover:bg-muted'
                            : 'bg-muted/50 border-border hover:bg-muted'
                  )}
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong> {opt.text}
                  {opt.correct && !answerRevealed && (
                    <span className="text-green-600 ml-1">{'\u2713'}</span>
                  )}
                  {answerRevealed && opt.correct && ' \u2714'}
                  {isMarked && !answerRevealed && ' \u25C0'}
                </button>
              )
            })
          ) : (
            <span className="text-sm text-muted-foreground">{t('runner.noAnswerOptions')}</span>
          )}
        </div>

        <span className="font-semibold text-sm text-right">{t('runner.used')}</span>
        <div className="flex items-center gap-2">
          <Label htmlFor="used-switch" className="text-sm">
            {used ? t('runner.yes') : t('runner.no')}
          </Label>
          <input
            id="used-switch"
            type="checkbox"
            role="switch"
            checked={used}
            onChange={onUse}
            className="h-4 w-4"
          />
        </div>

        <span className="font-semibold text-sm text-right">{t('runner.reveal')}</span>
        <div className="flex items-center gap-2">
          <Label htmlFor="reveal-switch" className="text-sm">
            {answerRevealed ? t('runner.yes') : t('runner.no')}
          </Label>
          <input
            id="reveal-switch"
            type="checkbox"
            role="switch"
            checked={answerRevealed}
            onChange={onRevealAnswer}
            className="h-4 w-4"
          />
        </div>
      </div>
    </div>
  )
}

export default BasicQuestionViewer
