<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading team details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Team</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchTeamData" class="btn-primary">Try Again</button>
    </div>

    <!-- Team Details -->
    <div v-else-if="team" class="space-y-6">
      <!-- Team Header -->
      <div class="card">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Team Logo -->
          <div class="w-32 h-32 rounded-full overflow-hidden">
            <img 
              v-if="team?.logo" 
              :src="team.logo" 
              :alt="team?.name || 'Team'"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-epl-blue to-epl-purple flex items-center justify-center"
            >
              <span class="text-white text-4xl font-bold">
                {{ (team?.name || 'T')?.charAt(0) }}
              </span>
            </div>
          </div>
          
          <!-- Team Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ team?.name || 'Team Name' }}</h1>
            <div class="space-y-2 text-gray-600">
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>Country:</strong> {{ team?.country || 'England' }}</span>
                <span><strong>Founded:</strong> {{ team?.founded || 'N/A' }}</span>
                <span><strong>Venue:</strong> {{ venue?.name || 'N/A' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Season Selector -->
          <div class="flex flex-col items-center space-y-2">
            <label class="text-sm font-medium text-gray-700">Season:</label>
            <select
              v-model="selectedSeason"
              @change="fetchTeamData"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div v-if="!loading && teamStats && Object.keys(teamStats).length > 0 && teamStats.position !== 'N/A'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ teamStats.position || 'N/A' }}</div>
            <div class="text-blue-100">League Position</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ teamStats.points || '0' }}</div>
            <div class="text-blue-100">Points</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ typeof teamStats.goalsFor === 'object' ? teamStats.goalsFor.total : teamStats.goalsFor || '0' }}</div>
            <div class="text-blue-100">Goals For</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ typeof teamStats.goalsAgainst === 'object' ? teamStats.goalsAgainst.total : teamStats.goalsAgainst || '0' }}</div>
            <div class="text-blue-100">Goals Against</div>
          </div>
        </div>
      </div>
      
      <!-- Venue Information -->
      <div v-if="venue?.name" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Stadium Information</h3>
        </div>
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Venue Image -->
          <div v-if="venue.image" class="w-48 h-32 rounded-lg overflow-hidden">
            <img 
              :src="venue.image" 
              :alt="venue.name"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
          </div>
          
          <!-- Venue Details -->
          <div class="flex-1 text-center md:text-left">
            <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ venue.name }}</h4>
            <div class="space-y-2 text-gray-600">
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>City:</strong> {{ venue.city }}</span>
                <span><strong>Capacity:</strong> {{ venue.capacity?.toLocaleString() }}</span>
                <span><strong>Surface:</strong> {{ venue.surface }}</span>
              </div>
              <div v-if="venue.address" class="text-sm">
                <strong>Address:</strong> {{ venue.address }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats Loading State -->
      <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="stat-card">
          <div class="text-center">
            <div class="animate-pulse bg-blue-200 h-8 w-16 mx-auto rounded mb-2"></div>
            <div class="text-blue-100">Loading...</div>
          </div>
        </div>
      </div>
      
      <!-- No Stats Available -->
      <div v-else class="card text-center py-8">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Statistics Not Available</h3>
        <p class="text-gray-600">Team statistics are not available for the selected season.</p>
      </div>

      <!-- Team Statistics -->
      <div v-if="!loading && teamStats && Object.keys(teamStats).length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Form and Results -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Season Form</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-epl-green">{{ teamStats.wins || 0 }}</div>
                <div class="text-sm text-gray-500">Wins</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-epl-gold">{{ teamStats.draws || 0 }}</div>
                <div class="text-sm text-gray-500">Draws</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-epl-red">{{ teamStats.losses || 0 }}</div>
                <div class="text-sm text-gray-500">Losses</div>
              </div>
            </div>
            
            <!-- Form Display -->
            <div v-if="teamForm.length > 0" class="border-t pt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Recent Form:</div>
              <div class="flex items-center justify-center space-x-2">
                <span
                  v-for="(result, index) in teamForm.slice(-5)"
                  :key="index"
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                    getFormResultClass(result)
                  ]"
                  :title="getFormResultTitle(result)"
                >
                  {{ result }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals and Cards -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Goals & Discipline</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-2xl font-bold text-epl-green">{{ typeof teamStats.goalsFor === 'object' ? teamStats.goalsFor.total : teamStats.goalsFor || 0 }}</div>
                <div class="text-sm text-gray-500">Goals Scored</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-epl-blue">{{ typeof teamStats.cleanSheets === 'object' ? teamStats.cleanSheets.total : teamStats.cleanSheets || 0 }}</div>
                <div class="text-sm text-gray-500">Clean Sheets</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-epl-purple">{{ typeof teamStats.failedToScore === 'object' ? teamStats.failedToScore.total : teamStats.failedToScore || 0 }}</div>
                <div class="text-sm text-gray-500">Failed to Score</div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Cards:</div>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-lg font-bold text-epl-gold">{{ getTotalCards(teamStats.yellowCards) }}</div>
                  <div class="text-xs text-gray-500">Yellow</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-epl-red">{{ getTotalCards(teamStats.redCards) }}</div>
                  <div class="text-xs text-gray-500">Red</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Fixtures -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Fixtures</h3>
          <router-link :to="`/fixtures?team=${teamId}`" class="text-epl-blue hover:text-epl-purple font-medium">
            View All →
          </router-link>
        </div>
        
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              <div class="flex items-center space-x-2">
                <div class="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                <span class="text-gray-400">vs</span>
                <div class="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            </div>
            <div class="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
          </div>
        </div>
        
        <div v-else-if="recentFixtures.length > 0" class="space-y-3">
          <div
            v-for="fixture in recentFixtures.slice(0, 5)"
            :key="fixture.fixture.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            @click="viewFixture(fixture.fixture.id)"
          >
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500 w-16">{{ formatDate(fixture?.fixture?.date) }}</div>
              <div class="flex flex-col space-y-1">
                <div class="text-xs text-gray-400">{{ fixture?.league?.name || 'League' }}</div>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="[
                      'font-medium',
                      getWinnerClass(fixture, 'home')
                    ]"
                  >
                    {{ fixture?.teams?.home?.name || 'Home Team' }}
                  </span>
                  <span class="text-gray-400">vs</span>
                  <span 
                    :class="[
                      'font-medium',
                      getWinnerClass(fixture, 'away')
                    ]"
                  >
                    {{ fixture?.teams?.away?.name || 'Away Team' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">{{ fixture?.fixture?.venue?.name || 'Venue TBD' }}</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div 
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(fixture?.fixture?.status?.short)
                ]"
              >
                {{ getStatusText(fixture?.fixture?.status?.short) }}
              </div>
              <div v-if="fixture?.fixture?.status?.short !== 'NS'" class="text-lg font-bold">
                <span :class="getWinnerClass(fixture, 'home')">{{ fixture?.goals?.home || 0 }}</span>
                <span class="text-gray-400"> - </span>
                <span :class="getWinnerClass(fixture, 'away')">{{ fixture?.goals?.away || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <p>No recent fixtures available</p>
        </div>
      </div>

      <!-- Team Players -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Squad Players</h3>
          <router-link :to="`/players?team=${teamId}`" class="text-epl-blue hover:text-epl-purple font-medium">
            View All →
          </router-link>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="i in 12" :key="i" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="animate-pulse bg-gray-200 w-12 h-12 rounded-full"></div>
              <div class="flex-1">
                <div class="animate-pulse bg-gray-200 h-4 w-24 rounded mb-2"></div>
                <div class="animate-pulse bg-gray-200 h-3 w-16 rounded"></div>
              </div>
              <div class="text-right">
                <div class="animate-pulse bg-gray-200 h-6 w-8 rounded mb-1"></div>
                <div class="animate-pulse bg-gray-200 h-3 w-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="teamPlayers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="player in teamPlayers"
            :key="player.id"
            class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            @click="viewPlayer(player.player?.id || player.id)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  v-if="player?.player?.photo" 
                  :src="player.player.photo" 
                  :alt="player?.player?.name || 'Player'"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
                <div 
                  v-else
                  class="w-full h-full bg-gradient-to-br from-epl-gold to-epl-red flex items-center justify-center"
                >
                  <span class="text-white text-lg font-bold">
                    {{ player?.player?.name?.charAt(0) || 'P' }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ player?.player?.name || 'Player Name' }}</div>
                <div class="text-sm text-gray-500">{{ getPlayerPosition(player) }}</div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-epl-red">{{ getPlayerGoals(player) }}</div>
                <div class="text-xs text-gray-500">goals</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <p>No player data available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teamsAPI, fixturesAPI, playerStatsAPI, standingsAPI } from '../services/api'

export default {
  name: 'TeamDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const teamId = computed(() => props.id || route.params.id)
    
    // Reactive data
    const team = ref(null)
    const venue = ref(null)
    const recentFixtures = ref([])
    const teamPlayers = ref([])
    const teamForm = ref([])
    const standings = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedSeason = ref(2025)

    // Computed properties
    const teamStats = computed(() => {
      let stats = null
      
      if (team.value?.statistics && Array.isArray(team.value.statistics) && team.value.statistics.length > 0) {
        // Look for Premier League statistics (league ID 39)
        stats = team.value.statistics.find(s => s.league?.id === 39) || team.value.statistics[0]
      }
      
      if (!stats || typeof stats !== 'object') {
        return {}
      }
      
      return {
        position: getTeamPosition() !== 'N/A' ? getTeamPosition() : (stats.league?.standings?.[0]?.rank || 'N/A'),
        points: getTeamPoints() !== 'N/A' ? getTeamPoints() : (stats.league?.standings?.[0]?.points || 0),
        goalsFor: stats.goals?.for?.total || 0,
        goalsAgainst: stats.goals?.against?.total || 0,
        wins: stats.fixtures?.wins?.total || 0,
        draws: stats.fixtures?.draws?.total || 0,
        losses: stats.fixtures?.loses?.total || 0,
        cleanSheets: stats.clean_sheet?.total || 0,
        failedToScore: stats.failed_to_score || 0,
        yellowCards: stats.cards?.yellow || 0,
        redCards: stats.cards?.red || 0
      }
    })

    // API functions
    const fetchStandings = async () => {
      try {
        const data = await standingsAPI.getStandings({ 
          season: selectedSeason.value,
          league: 39 // Premier League
        })
        
        if (data && data[0] && data[0].standings) {
          standings.value = data[0].standings[0] || []
        } else {
          standings.value = []
        }
      } catch (err) {
        console.error('Error fetching standings:', err)
        standings.value = []
      }
    }

    const fetchTeamData = async () => {
      loading.value = true
      error.value = null
      
      try {
        const [teamData, teamStatsData, fixturesData, playersData, formData] = await Promise.all([
          teamsAPI.getTeam(teamId.value),
          teamsAPI.getTeamStats(teamId.value, { season: selectedSeason.value }),
          teamsAPI.getTeamFixtures(teamId.value, { season: selectedSeason.value, last: 10 }),
          teamsAPI.getTeamPlayers(teamId.value, { season: selectedSeason.value }),
          fixturesAPI.getTeamForm(teamId.value, { season: selectedSeason.value, last: 10 })
        ])
        
        await fetchStandings()
        
        // Process team data
        if (teamData && typeof teamData === 'object') {
          if (teamData.response && Array.isArray(teamData.response) && teamData.response[0]) {
            const responseItem = teamData.response[0]
            team.value = { ...responseItem.team }
            venue.value = { ...responseItem.venue }
          } else if (teamData.team) {
            team.value = teamData.team
            venue.value = teamData.venue
          } else {
            team.value = teamData
            venue.value = teamData.venue
          }
          
          // Set team statistics
          if (teamStatsData && typeof teamStatsData === 'object') {
            team.value.statistics = [teamStatsData]
          } else {
            team.value.statistics = []
          }
        } else {
          team.value = null
          error.value = 'Invalid team data received from server.'
          return
        }
        
        // Process other data
        recentFixtures.value = Array.isArray(fixturesData) ? fixturesData : []
        teamPlayers.value = Array.isArray(playersData) ? playersData : []
        
        // Process form data
        if (team.value?.statistics?.[0]?.form) {
          teamForm.value = team.value.statistics[0].form.split('').slice(-5)
        } else if (formData && formData.form_summary) {
          const form = []
          for (let i = 0; i < formData.form_summary.total; i++) {
            if (i < formData.form_summary.wins) form.push('W')
            else if (i < formData.form_summary.wins + formData.form_summary.draws) form.push('D')
            else form.push('L')
          }
          teamForm.value = form.slice(-5)
        } else {
          teamForm.value = []
        }
        
      } catch (err) {
        console.error('Error fetching team data:', err)
        error.value = 'Failed to load team data. Please try again.'
        team.value = null
        recentFixtures.value = []
        teamPlayers.value = []
        teamForm.value = []
      } finally {
        loading.value = false
      }
    }

    // Navigation functions
    const viewFixture = (fixtureId) => {
      router.push(`/fixtures/${fixtureId}`)
    }

    const viewPlayer = (playerId) => {
      console.log('🔍 TeamDetail - Navigating to player:', {
        playerId,
        type: typeof playerId,
        route: `/players/${playerId}`
      })
      router.push(`/players/${playerId}`)
    }

    // Helper functions - Standings
    const getTeamPosition = () => {
      if (!standings.value.length || !team.value) return 'N/A'
      const standing = standings.value.find(s => s.team?.id === team.value.id)
      return standing ? standing.rank : 'N/A'
    }

    const getTeamPoints = () => {
      if (!standings.value.length || !team.value) return 'N/A'
      const standing = standings.value.find(s => s.team?.id === team.value.id)
      return standing ? standing.points : 'N/A'
    }

    // Helper functions - Form and Status
    const getFormResultClass = (result) => {
      switch (result) {
        case 'W': return 'bg-epl-green'
        case 'D': return 'bg-epl-gold'
        case 'L': return 'bg-epl-red'
        default: return 'bg-gray-300'
      }
    }

    const getFormResultTitle = (result) => {
      switch (result) {
        case 'W': return 'Win'
        case 'D': return 'Draw'
        case 'L': return 'Loss'
        default: return 'Unknown'
      }
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'LIVE': return 'bg-red-100 text-red-800'
        case 'FT': return 'bg-green-100 text-green-800'
        case 'NS': return 'bg-gray-100 text-gray-800'
        case 'HT': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getStatusText = (status) => {
      switch (status) {
        case 'LIVE': return 'LIVE'
        case 'FT': return 'FT'
        case 'NS': return 'Not Started'
        case 'HT': return 'HT'
        case '1H': return '1H'
        case '2H': return '2H'
        default: return status
      }
    }

    // Helper functions - Fixtures
    const getWinnerClass = (fixture, team) => {
      if (fixture?.fixture?.status?.short === 'NS' || fixture?.fixture?.status?.short === 'LIVE') {
        return 'text-gray-900'
      }
      
      const homeGoals = fixture?.goals?.home || 0
      const awayGoals = fixture?.goals?.away || 0
      
      if (homeGoals === awayGoals) {
        return 'text-gray-900'
      } else if (homeGoals > awayGoals) {
        return team === 'home' ? 'text-epl-green font-bold' : 'text-gray-600'
      } else {
        return team === 'away' ? 'text-epl-green font-bold' : 'text-gray-600'
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Invalid Date'
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short'
        })
      } catch (error) {
        return 'N/A'
      }
    }

    // Helper functions - Players
    const getPlayerStats = (player) => {
      if (!player?.statistics || !Array.isArray(player.statistics)) {
        return null
      }
      
      // Look for Premier League statistics (league ID 39)
      const premierLeagueStats = player.statistics.find(stat => stat.league?.id === 39)
      
      // If no Premier League stats found, return the first available stats
      return premierLeagueStats || player.statistics[0]
    }

    const getPlayerPosition = (player) => {
      const stats = getPlayerStats(player)
      return stats?.games?.position || 'N/A'
    }

    const getPlayerGoals = (player) => {
      const stats = getPlayerStats(player)
      return stats?.goals?.total || 0
    }

    // Helper functions - Statistics
    const getTotalCards = (cardsData) => {
      if (!cardsData || typeof cardsData !== 'object') return 0
      
      let total = 0
      for (const timeSlot in cardsData) {
        if (cardsData[timeSlot]?.total && typeof cardsData[timeSlot].total === 'number') {
          total += cardsData[timeSlot].total
        }
      }
      return total
    }

    // Lifecycle
    onMounted(() => {
      fetchTeamData()
    })

    return {
      // Reactive data
      teamId,
      team,
      venue,
      recentFixtures,
      teamPlayers,
      teamForm,
      standings,
      loading,
      error,
      selectedSeason,
      
      // Computed properties
      teamStats,
      
      // Functions
      fetchTeamData,
      fetchStandings,
      viewFixture,
      viewPlayer,
      
      // Helper functions
      getTeamPosition,
      getTeamPoints,
      getFormResultClass,
      getFormResultTitle,
      getStatusClass,
      getStatusText,
      getWinnerClass,
      formatDate,
      getPlayerStats,
      getPlayerPosition,
      getPlayerGoals,
      getTotalCards
    }
  }
}
</script>
