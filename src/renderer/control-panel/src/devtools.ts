export function populateTT() {
  const teamNames = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa'
  ]
  const numTeams = Math.floor(Math.random() * 6) + 3 // 3 to 8 teams
  const teams = Array.from({ length: numTeams }, (_, i) => ({
    id: i + 1,
    name: 'Team ' + teamNames[i % teamNames.length],
    score: Math.floor(Math.random() * 101)
  }))
  localStorage.setItem('teams', JSON.stringify(teams))
  window.location.reload()
}
