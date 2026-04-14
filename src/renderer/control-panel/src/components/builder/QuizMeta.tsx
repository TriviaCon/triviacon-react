import { useState } from 'react'
import { BarChart3, Info } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { QuizStatsModal } from './QuizStatsModal'
import {
  useQuizMeta,
  useUpdateName,
  useUpdateAuthor,
  useUpdateDate,
  useUpdateLocation
} from '@renderer/hooks/useQuizMeta'

export const QuizMeta = () => {
  const meta = useQuizMeta()
  const updateName = useUpdateName()
  const updateAuthor = useUpdateAuthor()
  const updateDate = useUpdateDate()
  const updateLocation = useUpdateLocation()
  const [showStatsModal, setShowStatsModal] = useState(false)

  if (!meta.data) {
    return <span className="text-muted-foreground">loading...</span>
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Quiz</h2>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" /> Quiz Info
            </span>
            <Button variant="outline" size="sm" onClick={() => setShowStatsModal(true)}>
              <BarChart3 className="mr-1 h-4 w-4" /> Stats
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="quiz-name" className="w-16 text-right text-sm shrink-0">
                  Name
                </Label>
                <Input
                  id="quiz-name"
                  placeholder="Quiz Name"
                  value={meta.data.name}
                  onChange={(e) => updateName.mutate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="quiz-author" className="w-16 text-right text-sm shrink-0">
                  Author
                </Label>
                <Input
                  id="quiz-author"
                  placeholder="Quiz Author"
                  value={meta.data.author}
                  onChange={(e) => updateAuthor.mutate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="quiz-date" className="w-16 text-right text-sm shrink-0">
                  Date
                </Label>
                <Input
                  id="quiz-date"
                  type="date"
                  value={meta.data.date}
                  onChange={(e) => updateDate.mutate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="quiz-location" className="w-16 text-right text-sm shrink-0">
                  Location
                </Label>
                <Input
                  id="quiz-location"
                  placeholder="Quiz Location"
                  value={meta.data.location}
                  onChange={(e) => updateLocation.mutate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-40 shrink-0">
              <img
                src={meta.data.splash ?? 'https://placehold.co/1280x720/transparent/CCC.png'}
                className="w-full rounded border border-border"
                alt="Quiz splash"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <QuizStatsModal show={showStatsModal} onHide={() => setShowStatsModal(false)} />
    </>
  )
}
