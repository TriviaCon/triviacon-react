import { Button, Card, Form } from 'react-bootstrap'
import { CloudUpload, Trash } from 'react-bootstrap-icons'
import toBase64 from '@renderer/utils/toBase64'
import { useQuestion } from '@renderer/hooks/useQuestion'
import { Question } from '@renderer/types'
import { useUpdateQuestionMutation } from '@renderer/hooks/useUpdateQuestionMutation'
import { useAnswerOptions } from '@renderer/hooks/useAnswerOptions'
import { useUpdateAnswerOptionMutation } from '@renderer/hooks/useUpdateAnswerOptionMutation'
import { useDeleteAnswerOptionMutation } from '@renderer/hooks/useDeleteAnswerOptionMutation'
import { useAddAnswerOptionMutation } from '@renderer/hooks/useAddAnswerOptionMutation'

const QuestionView = ({ id }: { id: number }) => {
  const question = useQuestion(id)
  const answerOptions = useAnswerOptions(id)
  const addOption = useAddAnswerOptionMutation(id)
  const updateOption = useUpdateAnswerOptionMutation(id)
  const deleteOption = useDeleteAnswerOptionMutation(id)
  const updateQuestionMutation = useUpdateQuestionMutation(id)

  const update = (q: Partial<Question>) => updateQuestionMutation.mutate(q)

  if (!question.data || !answerOptions.data) {
    return 'loading...'
  }

  return (
    <div className="h-100 d-flex flex-column">
      <h2>
        {/* Question ({category.name},{' '} */}
        {/* {category.questions.findIndex((question) => question.qID === qID) + 1}/ */}
        {/* {category.questions.length}) */}
      </h2>
      <Form>
        <Form.Group className="mb-1">
          <Form.Label htmlFor="question">Question:</Form.Label>
          <Form.Control
            type="text"
            id="question"
            value={question.data.text}
            onChange={(e) => update({ text: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="questionType">Type:</Form.Label>
          <Form.Select
            id="questionType"
            value={question.data.type}
            onChange={(e) => update({ type: e.target.value as Question['type'] })}
          >
            <option value="single-answer">Single Answer</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="list">List</option>
          </Form.Select>
        </Form.Group>
        <Card className="mb-3">
          <Card.Body className="py-1 px-2">
            <h6 className="mt-0">Media:</h6>
            <Card
              style={{
                flexShrink: 0,
                flexGrow: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {question.data.media && <img src={question.data.media} className="w-50" />}
              <Card.Body className="py-1 px-2 d-flex justify-content-center align-items-center">
                <div
                  className="drag-upload-area"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file && question) {
                      update({ media: await toBase64(file) })
                    }
                  }}
                  style={{
                    border: '2px dashed #007bff',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <CloudUpload size={32} />
                  <p>Drag and drop your file here or click to select</p>
                  <input
                    type="file"
                    accept="image/*, video/*, audio/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file && question) {
                        update({ media: await toBase64(file) })
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </Card.Body>
            </Card>{' '}
            <Form.Control
              type="text"
              id="media"
              value={question.data.media ?? ''}
              onChange={(e) => update({ media: e.target.value })}
            />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="py-1 px-2">
            <h6 className="mt-0 d-flex justify-content-between align-items-center">
              Answer Options
              <Button size="sm" className="ms-auto" onClick={() => addOption.mutate()}>
                Add
              </Button>
            </h6>
            <Form.Group className="mb-3">
              {answerOptions.data.map((opt, index) => (
                <div key={opt.id} className="d-flex align-items-center mb-2">
                  <Form.Check
                    type="checkbox"
                    checked={opt.correct}
                    onChange={(e) => updateOption.mutate({ id: opt.id, correct: e.target.checked })}
                    className="me-2"
                    title="Correct answer"
                  />
                  <Form.Label htmlFor={`option-${index}`} className="me-2 mb-0">
                    <strong>{String.fromCharCode(65 + index)}.</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id={`option-${index}`}
                    value={opt.text}
                    onChange={(e) => {
                      updateOption.mutate({ id: opt.id, text: e.target.value })
                    }}
                  />
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => deleteOption.mutate(opt.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </Form.Group>
          </Card.Body>
        </Card>
      </Form>
    </div>
  )
}
export default QuestionView
