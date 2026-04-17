import { useTranslation } from 'react-i18next'
import { CloudUpload, Trash2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { NativeSelect } from '@renderer/components/ui/native-select'
import { Label } from '@renderer/components/ui/label'
import { Card, CardContent } from '@renderer/components/ui/card'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { Question } from '@shared/types/quiz'
import { useUpdateQuestionMutation } from '@renderer/hooks/useUpdateQuestionMutation'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import { useUpdateAnswerOptionMutation } from '@renderer/hooks/useUpdateAnswerOptionMutation'
import { useDeleteAnswerOptionMutation } from '@renderer/hooks/useDeleteAnswerOptionMutation'
import { useAddAnswerOptionMutation } from '@renderer/hooks/useAddAnswerOptionMutation'
import { QueryLoading, QueryError } from '@renderer/components/ui/query-state'
import { MediaPreview } from '@renderer/components/ui/media-preview'
import { usePairQueryState } from '@renderer/hooks/usePairQueryState'

const QuestionView = ({ id }: { id: number }) => {
  const { t } = useTranslation()
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)
  const addOption = useAddAnswerOptionMutation(id)
  const updateOption = useUpdateAnswerOptionMutation(id)
  const deleteOption = useDeleteAnswerOptionMutation(id)
  const updateQuestionMutation = useUpdateQuestionMutation(id)

  const update = (q: Partial<Question>) => updateQuestionMutation.mutate(q)

  const guard = usePairQueryState(question, answerOptions)
  if (!guard.ok) {
    if (guard.loading) return <QueryLoading label={t('builder.loadingQuestion')} />
    if (guard.errorMessage) return <QueryError message={guard.errorMessage} />
    return null
  }

  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="space-y-1">
        <Label htmlFor="question">{t('builder.question')}</Label>
        <Input
          id="question"
          value={question.data!.text}
          onChange={(e) => update({ text: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="questionType">{t('builder.type')}</Label>
        <NativeSelect
          id="questionType"
          value={question.data!.type}
          onChange={(e) => update({ type: e.target.value as Question['type'] })}
        >
          <option value="single-answer">{t('builder.typeSingle')}</option>
          <option value="multiple-choice">{t('builder.typeMultiple')}</option>
          <option value="list">{t('builder.typeList')}</option>
        </NativeSelect>
      </div>

      <Card>
        <CardContent className="py-2 px-3 space-y-2">
          <h6 className="text-sm font-semibold">{t('builder.media')}</h6>
          {question.data!.media ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 border border-border rounded p-2">
                <MediaPreview media={question.data!.media} />
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const path = await window.api.mediaPickFile(id)
                    if (path) question.refetch()
                  }}
                >
                  {t('actions.change')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={async () => {
                    await window.api.mediaRemoveFile(id)
                    question.refetch()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                const path = await window.api.mediaPickFile(id)
                if (path) question.refetch()
              }}
            >
              <CloudUpload className="mr-2 h-4 w-4" /> {t('builder.attachMedia')}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-2 px-3">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-sm font-semibold">{t('builder.answerOptions')}</h6>
            <Button size="sm" onClick={() => addOption.mutate()}>
              {t('actions.add')}
            </Button>
          </div>
          <div className="space-y-2">
            {answerOptions.data!.map((opt, index) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={opt.correct}
                  onChange={(e) => updateOption.mutate({ id: opt.id, correct: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                  title={t('builder.correctAnswer')}
                />
                <Label className="font-semibold shrink-0">{String.fromCharCode(65 + index)}.</Label>
                <Input
                  value={opt.text}
                  onChange={(e) => updateOption.mutate({ id: opt.id, text: e.target.value })}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={() => deleteOption.mutate(opt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionView
