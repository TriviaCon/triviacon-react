import { CloudUpload, Trash2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Card, CardContent } from '@renderer/components/ui/card'
import toBase64 from '@renderer/utils/toBase64'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { Question } from '@shared/types/quiz'
import { useUpdateQuestionMutation } from '@renderer/hooks/useUpdateQuestionMutation'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import { useUpdateAnswerOptionMutation } from '@renderer/hooks/useUpdateAnswerOptionMutation'
import { useDeleteAnswerOptionMutation } from '@renderer/hooks/useDeleteAnswerOptionMutation'
import { useAddAnswerOptionMutation } from '@renderer/hooks/useAddAnswerOptionMutation'
import { QueryLoading, QueryError } from '@renderer/components/ui/query-state'

const QuestionView = ({ id }: { id: number }) => {
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)
  const addOption = useAddAnswerOptionMutation(id)
  const updateOption = useUpdateAnswerOptionMutation(id)
  const deleteOption = useDeleteAnswerOptionMutation(id)
  const updateQuestionMutation = useUpdateQuestionMutation(id)

  const update = (q: Partial<Question>) => updateQuestionMutation.mutate(q)

  if (question.isLoading || answerOptions.isLoading) {
    return <QueryLoading label="Loading question..." />
  }
  if (question.error || answerOptions.error) {
    return <QueryError message={question.error?.message ?? answerOptions.error?.message} />
  }
  if (!question.data || !answerOptions.data) return null

  return (
    <div className="h-full flex flex-col space-y-3">
      <div className="space-y-1">
        <Label htmlFor="question">Question:</Label>
        <Input
          id="question"
          value={question.data.text}
          onChange={(e) => update({ text: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="questionType">Type:</Label>
        <select
          id="questionType"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          value={question.data.type}
          onChange={(e) => update({ type: e.target.value as Question['type'] })}
        >
          <option value="single-answer">Single Answer</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="list">List</option>
        </select>
      </div>

      <Card>
        <CardContent className="py-2 px-3 space-y-2">
          <h6 className="text-sm font-semibold">Media:</h6>
          <div className="flex items-center justify-center border border-border rounded">
            {question.data.media && <img src={question.data.media} className="w-1/2 rounded" />}
            <div
              className="flex-1 p-4 text-center cursor-pointer border-2 border-dashed border-primary/40 rounded m-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) update({ media: await toBase64(file) })
              }}
            >
              <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">Drag and drop or click to select</p>
              <input
                type="file"
                accept="image/*, video/*, audio/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) update({ media: await toBase64(file) })
                }}
              />
            </div>
          </div>
          <Input
            placeholder="Media URL"
            value={question.data.media ?? ''}
            onChange={(e) => update({ media: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-2 px-3">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-sm font-semibold">Answer Options</h6>
            <Button size="sm" onClick={() => addOption.mutate()}>
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {answerOptions.data.map((opt, index) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={opt.correct}
                  onChange={(e) => updateOption.mutate({ id: opt.id, correct: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                  title="Correct answer"
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
