import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const url = config.url
    const params = config.params
    const fullUrl = params && Object.keys(params).length > 0 
      ? `${url}?${new URLSearchParams(params).toString()}`
      : url
    console.log(`API Request: ${config.method?.toUpperCase()} ${fullUrl}`)
    console.log(`API Request Details:`, { url, params, fullUrl })
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    const data = response.data
    
    // Handle the specific API response structure
    if (data && data.response !== undefined) {
      console.log(`API Response for ${response.config.url}:`, data)
      
      // For team endpoints, return the full response object to preserve structure
      if (response.config.url.includes('/teams/') && !response.config.url.includes('/statistics') && !response.config.url.includes('/fixtures') && !response.config.url.includes('/players')) {
        console.log('Team endpoint - returning full response object')
        return data
      }
      
      // For statistics endpoints, return the response object directly
      if (response.config.url.includes('/statistics')) {
        console.log('Statistics endpoint - returning response object')
        return data.response
      }
      
      // For standings endpoints, return the response object directly
      if (response.config.url.includes('/standings/')) {
        console.log('Standings endpoint - returning response object')
        return data.response
      }
      
      // For fixtures endpoints, return the response array directly
      if (response.config.url.includes('/fixtures')) {
        console.log('Fixtures endpoint - returning response array')
        return data.response
      }
      
      // For players endpoints, return the response array directly
      if (response.config.url.includes('/players')) {
        console.log('Players endpoint - returning response array')
        return data.response
      }
      
      // If it's a single item, return the first item from response array
      if (data.results === 1 && Array.isArray(data.response) && data.response.length > 0) {
        console.log('Single item response - unwrapping first item')
        return data.response[0]
      }
      
      // If it's multiple items, return the full response object
      console.log('Multiple items response - returning full object with nested structure')
      return data
    }
    
    // Handle the double nested structure for single team endpoints
    if (data && data.team && data.team.team && data.venue && data.venue.venue) {
      console.log('Double nested structure detected - unwrapping')
      return {
        ...data,
        team: data.team.team,
        venue: data.venue.venue
      }
    }
    
    return data
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Teams API
export const teamsAPI = {
  // Get all teams with optional filtering
  getTeams: (params = {}) => api.get('/teams/', { params }),
  
  // Get specific team details
  getTeam: (teamId) => api.get(`/teams/${teamId}`),
  
  // Get team statistics
  getTeamStats: (teamId, params = {}) => api.get(`/teams/${teamId}/statistics`, { params }),
  
  // Get team seasons
  getTeamSeasons: (teamId) => api.get(`/teams/${teamId}/seasons`),
  
  // Get team countries
  getTeamCountries: (teamId) => api.get(`/teams/${teamId}/countries`),
  
  // Get team leagues
  getTeamLeagues: (teamId, params = {}) => api.get(`/teams/${teamId}/leagues`, { params }),
  
  // Get team fixtures
  getTeamFixtures: (teamId, params = {}) => api.get(`/teams/${teamId}/fixtures`, { params }),
  
  // Get team players
  getTeamPlayers: (teamId, params = {}) => api.get(`/teams/${teamId}/players`, { params }),
  
  // Search teams
  searchTeams: (search, params = {}) => api.get('/teams/search', { params: { search, ...params } }),
}

// Fixtures API
export const fixturesAPI = {
  // Get all fixtures with filtering
  getFixtures: (params = {}) => api.get('/fixtures/', { params }),
  
  // Get specific fixture
  getFixture: (fixtureId) => api.get(`/fixtures/${fixtureId}`),
  
  // Get fixture events
  getFixtureEvents: (fixtureId) => api.get(`/fixtures/${fixtureId}/events`),
  
  // Get fixture lineups
  getFixtureLineups: (fixtureId) => api.get(`/fixtures/${fixtureId}/lineups`),
  
  // Get fixture statistics
  getFixtureStats: (fixtureId) => api.get(`/fixtures/${fixtureId}/statistics`),
  
  // Get fixture players
  getFixturePlayers: (fixtureId) => api.get(`/fixtures/${fixtureId}/players`),
  
  // Get stored fixture player stats
  getStoredFixturePlayerStats: (fixtureId) => api.get(`/fixtures/${fixtureId}/players/stored`),
  
  // Get live fixtures
  getLiveFixtures: (params = {}) => api.get('/fixtures/live', { params }),
  
  // Get head-to-head fixtures
  getHeadToHead: (h2h, params = {}) => api.get('/fixtures/head-to-head', { params: { h2h, ...params } }),
  
  // Get fixture rounds
  getFixtureRounds: (leagueId, params = {}) => api.get('/fixtures/rounds', { params: { league: leagueId, ...params } }),
  
  // Get fixtures by date
  getFixturesByDate: (date, params = {}) => api.get(`/fixtures/date/${date}`, { params }),
  
  // Get round fixtures
  getRoundFixtures: (leagueId, seasonId, round) => api.get(`/fixtures/league/${leagueId}/season/${seasonId}/round/${round}`),
  
  // Get team form
  getTeamForm: (teamId, params = {}) => api.get(`/fixtures/team/${teamId}/form`, { params }),
}

// Standings API
export const standingsAPI = {
  // Get standings
  getStandings: (params = {}) => api.get('/standings/', { params }),
}

// Defense API
export const defenseAPI = {
  // Get defense table
  getDefenseTable: (params = {}) => api.get('/defense/table', { params }),
}

// Team Statistics API
export const teamStatsAPI = {
  // Get team overview
  getTeamOverview: (teamId, params = {}) => api.get(`/team-stats/${teamId}/overview`, { params }),
  
  // Get team goals
  getTeamGoals: (teamId, params = {}) => api.get(`/team-stats/${teamId}/goals`, { params }),
  
  // Get team fixtures stats
  getTeamFixturesStats: (teamId, params = {}) => api.get(`/team-stats/${teamId}/fixtures-stats`, { params }),
  
  // Get team cards
  getTeamCards: (teamId, params = {}) => api.get(`/team-stats/${teamId}/cards`, { params }),
  
  // Get team lineups
  getTeamLineups: (teamId, params = {}) => api.get(`/team-stats/${teamId}/lineups`, { params }),
  
  // Compare team stats
  compareTeamStats: (teamId, params = {}) => api.get(`/team-stats/${teamId}/comparison`, { params }),
  
  // Get league team stats
  getLeagueTeamStats: (leagueId, seasonId, params = {}) => api.get(`/team-stats/league/${leagueId}/season/${seasonId}`, { params }),
  
  // Get league teams
  getLeagueTeams: (leagueId, seasonId) => api.get(`/team-stats/league/${leagueId}/season/${seasonId}/teams`),
}

// Player Statistics API
export const playerStatsAPI = {
  // Get player statistics
  getPlayerStats: (playerId, params = {}) => api.get(`/player-stats/player/${playerId}`, { params }),
  
  // Get league player statistics
  getLeaguePlayerStats: (leagueId, params = {}) => api.get(`/player-stats/league/${leagueId}`, { params }),
  
  // Get team player statistics
  getTeamPlayerStats: (teamId, params = {}) => api.get(`/player-stats/team/${teamId}`, { params }),
  
  // Get player seasons
  getPlayerSeasons: (playerId) => api.get(`/player-stats/player/${playerId}/seasons`),
  
  // Get player countries
  getPlayerCountries: () => api.get('/player-stats/countries'),
  
  // Search players
  searchPlayers: (search, params = {}) => api.get('/player-stats/search', { params: { search, ...params } }),
  
  // Get top scorers
  getTopScorers: (leagueId, season, params = {}) => api.get('/player-stats/top-scorers', { params: { league: leagueId, season, ...params } }),
  
  // Get top assists
  getTopAssists: (leagueId, season, params = {}) => api.get('/player-stats/top-assists', { params: { league: leagueId, season, ...params } }),
  
  // Get defensive leaders
  getDefensiveLeaders: (leagueId, season, params = {}) => api.get('/player-stats/defensive-leaders', { params: { league: leagueId, season, ...params } }),
}

// Ingestion API
export const ingestionAPI = {
  // Ingest league data
  ingestLeagueData: (leagueId, season) => api.post(`/ingestion/league/${leagueId}/season/${season}`),
  
  // Get ingestion status
  getIngestionStatus: (leagueId, season) => api.get(`/ingestion/status/${leagueId}/${season}`),
  
  // Quick EPL 2025 ingestion
  ingestEPL2025: () => api.post('/ingestion/epl/2025'),
  
  // Health check
  health: () => api.get('/ingestion/health'),
}

// Health API
export const healthAPI = {
  // Health check
  health: () => api.get('/health'),
}

// Leagues API
export const leaguesAPI = {
  // Get leagues
  getLeagues: () => api.get('/leagues/'),
}

export default api
