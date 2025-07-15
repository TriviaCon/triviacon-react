import React, { FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { FastForwardCircleFill, PersonFillAdd, PersonXFill, RewindCircleFill, Trash } from "react-bootstrap-icons";

interface Team {
  id: number;
  name: string;
  score: number;
}

const TeamTable: React.FC = () => {
  const [teams, setTeams] = useLocalStorage<Team[]>("teams", []);
  const [currentTeam, setCurrentTeam] = useLocalStorage<Team | null>("currentTeam", null);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  const handleAddTeam = (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const newTeamName = data.get("teamName") as string;
    if (
      teams.some(
        (team: { name: string }) => team.name.toLowerCase() === newTeamName.toLowerCase()
      )
    ) {
      alert("A team with this name already exists!");
      return;
    }
    setTeams([...teams, { id: Date.now(), name: newTeamName, score: 0 }]);
    form.reset();
  };

  const handleRemoveTeam = (id: number) => {
    const newTeams = teams.filter(team => team.id !== id);

    // If the current team is being deleted, pick the next team in the original order
    if (currentTeam?.id === id) {
      if (newTeams.length === 0) {
        setCurrentTeam(null);
      } else {
        // Find the index of the deleted team
        const deletedIndex = teams.findIndex(team => team.id === id);
        // Pick the next team, or previous if last was deleted
        const nextIndex = deletedIndex >= newTeams.length ? newTeams.length - 1 : deletedIndex;
        setCurrentTeam(newTeams[nextIndex]);
      }
    } else {
      // If currentTeam is not in the new list, set to null
      if (!newTeams.some(team => team.id === currentTeam?.id)) {
        setCurrentTeam(null);
      }
    }

    setTeams(newTeams as Team[]);
  };

  const handleUpdateScore = (id: number, mod: number) => {
    const teamToUpdate = teams.find(
      (team: Team) => team.id === id
    );
    if (teamToUpdate) {
      const newScore = teamToUpdate.score + mod;
      setTeams(
        teams.map((team: Team) =>
          team.id === id ? { ...team, score: newScore, name: team.name, id: team.id } : team
        )
      );
    }
  };

  const handleEditTeamName = (team: { id: number; name: string }) => {
    setEditingTeamId(team.id);
    setEditingTeamName(team.name);
  };

  const handleSaveTeamName = () => {
    if (editingTeamId !== null) {
      setTeams(
        teams.map((team: Team) =>
          team.id === editingTeamId ? { ...team, name: editingTeamName } : team
        )
      );
      setEditingTeamId(null);
      setEditingTeamName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeamName("");
  };

  // For display: sort by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="d-flex flex-column zzzh-100">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h2 className="mb-0 me-2">Teams</h2>
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-1"
            title="Clear all teams"
            onClick={() => {
              setTeams([]);
              setCurrentTeam(null);
            }}
          >
            <Trash />
          </Button>
        </div>
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
      <Alert
        variant="light"
        className="d-flex justify-content-between align-items-center mb-0"
      >
        <span>Current Team:</span>
        <span>
          <strong>{currentTeam?.name || "No team selected"}</strong>
        </span>
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={() => {
              if (!teams.length) return;
              const currentIndex = teams.findIndex(team => team.id === currentTeam?.id);
              const prevIndex = currentIndex === -1
                ? 0
                : (currentIndex - 1 + teams.length) % teams.length;
              setCurrentTeam(teams[prevIndex]);
            }}
          >
            <RewindCircleFill className="me-1" />
            Prev.
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              if (!teams.length) return;
              const currentIndex = teams.findIndex(team => team.id === currentTeam?.id);
              const nextIndex = currentIndex === -1
                ? 0
                : (currentIndex + 1) % teams.length;
              setCurrentTeam(teams[nextIndex]);
            }}
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
                      if (e.key === "Enter") {
                        handleSaveTeamName();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    onBlur={handleSaveTeamName}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleEditTeamName(team)}
                    style={{ cursor: "pointer" }}
                  >
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
                      handleRemoveTeam(team.id);
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
  );
};

export default TeamTable;
