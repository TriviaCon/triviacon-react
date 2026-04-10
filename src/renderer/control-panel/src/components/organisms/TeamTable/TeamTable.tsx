import React, { FormEvent, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Table } from 'react-bootstrap'
import { useGameState } from '@renderer/hooks/useGameState'
import {
  FastForwardCircleFill,
  PersonFillAdd,
  PersonXFill,
  RewindCircleFill
} from 'react-bootstrap-icons'

const TeamTable: React.FC = () => {
  const gameState = useGameState()
  const { teams, currentTeamId } = gameState
  const currentTeam = teams.find((t) => t.id === currentTeamId) ?? null

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingTeamName, setEditingTeamName] = useState('')

  const handleAddTeam = (event: FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const data = new FormData(form)
    const name = data.get('teamName') as string
    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      alert('A team with this name already exists!')
      return
    }
    window.api.addTeam(name)
    form.reset()
  }

  const handleRemoveTeam = (teamId: string) => {
    window.api.removeTeam(teamId)
  }

  const handleUpdateScore = (teamId: string, delta: number) => {
    window.api.updateScore(teamId, delta)
  }

  const handleEditTeamName = (team: { id: string; name: string }) => {
    setEditingTeamId(team.id)
    setEditingTeamName(team.name)
  }

  const handleSaveTeamName = () => {
    if (editingTeamId !== null) {
      window.api.renameTeam(editingTeamId, editingTeamName)
      setEditingTeamId(null)
      setEditingTeamName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingTeamId(null)
    setEditingTeamName('')
  }

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="d-flex flex-column zzzh-100">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0 me-2">Teams</h2>
        <Form className="d-flex align-items-center" onSubmit={handleAddTeam}>
          <Form.Group className="input-group input-group-sm">
            <Form.Control
              type="text"
              name="teamName"
              placeholder="Team Name"
              aria-label="Team Name"
              required
            />
            <Button variant="primary" type="submit">
              <PersonFillAdd className="me-1" />
              Add Team
            </Button>
          </Form.Group>
        </Form>
      </div>
      <Alert variant="light" className="d-flex justify-content-between align-items-center mb-0">
        <span>Current Team:</span>
        <span>
          <strong>{currentTeam?.name || 'No team selected'}</strong>
        </span>
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={() => window.api.prevTeam()}
          >
            <RewindCircleFill className="me-1" />
            Prev.
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => window.api.nextTeam()}
          >
            <FastForwardCircleFill className="me-1" />
            Next
          </Button>
        </div>
      </Alert>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th className="text-center">Score</th>
            <th className="text-center">Del. Team?</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => (
            <tr key={team.id}>
              <th>{index + 1}</th>
              <td>
                {editingTeamId === team.id ? (
                  <Form.Control
                    type="text"
                    value={editingTeamName}
                    onChange={(e) => setEditingTeamName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveTeamName()
                      } else if (e.key === 'Escape') {
                        handleCancelEdit()
                      }
                    }}
                    onBlur={handleSaveTeamName}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleEditTeamName(team)} style={{ cursor: 'pointer' }}>
                    {team.name}
                  </span>
                )}
              </td>
              <td className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleUpdateScore(team.id, -1)}
                >
                  -1
                </Button>
                <span>{team.score}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleUpdateScore(team.id, 1)}
                >
                  +1
                </Button>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete team '${team.name}'?`)) {
                      handleRemoveTeam(team.id)
                    }
                  }}
                >
                  <PersonXFill className="me-1" />
                </Button>
              </td>
            </tr>
          ))}
          {teams.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">
                No teams added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default TeamTable
