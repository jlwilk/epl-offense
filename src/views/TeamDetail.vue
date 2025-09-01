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
                <span><strong>Country:</strong> {{ venue?.country || 'England' }}</span>
                <span><strong>Founded:</strong> {{ team?.founded || 'N/A' }}</span>
                <span><strong>Venue:</strong> {{ team?.venue_name || 'N/A' }}</span>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>City:</strong> {{ team?.venue_city || 'N/A' }}</span>
                <span><strong>Capacity:</strong> {{ team?.venue_capacity?.toLocaleString() || 'N/A' }}</span>
                <span><strong>Surface:</strong> {{ team?.venue_surface || 'N/A' }}</span>
              </div>
              <div v-if="team?.venue_address" class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>Address:</strong> {{ team.venue_address }}</span>
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
      <div v-if="team?.venue_name" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Stadium Information</h3>
        </div>
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Venue Image -->
          <div v-if="team.venue_image" class="w-48 h-32 rounded-lg overflow-hidden">
            <img 
              :src="team.venue_image" 
              :alt="team.venue_name"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
          </div>
          
          <!-- Venue Details -->
          <div class="flex-1 text-center md:text-left">
            <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ team.venue_name }}</h4>
            <div class="space-y-2 text-gray-600">
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>City:</strong> {{ team.venue_city }}</span>
                <span><strong>Capacity:</strong> {{ team.venue_capacity?.toLocaleString() }}</span>
                <span><strong>Surface:</strong> {{ team.venue_surface }}</span>
              </div>
              <div v-if="team.venue_address" class="text-sm">
                <strong>Address:</strong> {{ team.venue_address }}
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
            <div class="grid grid-cols-2 gap-4">
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
              <div class="flex items-center space-x-2">
                <span class="font-medium">{{ fixture?.teams?.home?.name || 'Home Team' }}</span>
                <span class="text-gray-400">vs</span>
                <span class="font-medium">{{ fixture?.teams?.away?.name || 'Away Team' }}</span>
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
                {{ fixture?.goals?.home || 0 }} - {{ fixture?.goals?.away || 0 }}
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
        
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="bg-gray-50 rounded-lg p-4">
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
        
        <div v-else-if="teamPlayers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="player in teamPlayers.slice(0, 6)"
            :key="player.id"
            class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            @click="viewPlayer(player.id)"
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
                <div class="text-sm text-gray-500">{{ player?.statistics?.[0]?.games?.position || 'N/A' }}</div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-epl-red">{{ player?.statistics?.[0]?.goals?.total || 0 }}</div>
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
    
    const team = ref(null)
    const recentFixtures = ref([])
    const teamPlayers = ref([])
    const teamForm = ref([])
    const standings = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedSeason = ref(2025)

    const fetchStandings = async () => {
      try {
        const data = await standingsAPI.getStandings({ 
          season: selectedSeason.value,
          league: 39 // Premier League
        })
        
        if (data && data.league && data.league.standings) {
          // Extract the standings array from the nested structure
          standings.value = data.league.standings[0] || []
        } else {
          standings.value = []
        }
      } catch (err) {
        console.error('Error fetching standings:', err)
        standings.value = []
      }
    }

    const getTeamPosition = () => {
      if (!standings.value.length || !team.value) return 'N/A'
      
      const teamId = team.value.id
      const standing = standings.value.find(s => s.team?.id === teamId)
      return standing ? standing.rank : 'N/A'
    }

    const getTeamPoints = () => {
      if (!standings.value.length || !team.value) return 'N/A'
      
      const teamId = team.value.id
      const standing = standings.value.find(s => s.team?.id === teamId)
      return standing ? standing.points : 'N/A'
    }

    const teamStats = computed(() => {
      // First try to get stats from the team's statistics array
      let stats = null
      
      if (team.value?.statistics && Array.isArray(team.value.statistics) && team.value.statistics.length > 0) {
        // Look for the specific league statistics (Premier League - league ID 39)
        stats = team.value.statistics.find(s => s.league?.id === 39) || team.value.statistics[0]
        console.log('🔍 TeamStats Debug - Found stats:', {
          stats,
          hasLeague: !!stats?.league,
          leagueId: stats?.league?.id,
          leagueName: stats?.league?.name,
          hasGoals: !!stats?.goals,
          hasFixtures: !!stats?.fixtures,
          hasCards: !!stats?.cards
        })
      }
      
      if (!stats || typeof stats !== 'object') {
        // Fallback: try to get stats from the teamStatsData if it was stored separately
        console.log('🔍 TeamStats Debug - No valid stats found')
        return {}
      }
      
      const result = {
        position: getTeamPosition() !== 'N/A' ? getTeamPosition() : (stats.league?.standings?.[0]?.rank || 'N/A'),
        points: getTeamPoints() !== 'N/A' ? getTeamPoints() : (stats.league?.standings?.[0]?.points || 0),
        goalsFor: stats.goals?.for?.total || 0,
        goalsAgainst: stats.goals?.against?.total || 0,
        wins: stats.fixtures?.wins?.total || 0,
        draws: stats.fixtures?.draws?.total || 0,
        losses: stats.fixtures?.loses?.total || 0,
        cleanSheets: stats.clean_sheets || 0,
        failedToScore: stats.failed_to_score || 0,
        yellowCards: stats.cards?.yellow || 0,
        redCards: stats.cards?.red || 0
      }
      
      console.log('🔍 TeamStats Debug - Computed result:', result)
      return result
    })

    const fetchTeamData = async () => {
      loading.value = true
      error.value = null
      
      try {
        console.log('🔍 TeamDetail Debug - Fetching team data:', {
          teamId: teamId.value,
          selectedSeason: selectedSeason.value
        })
        
        const [teamData, teamStatsData, fixturesData, playersData, formData] = await Promise.all([
          teamsAPI.getTeam(teamId.value),
          teamsAPI.getTeamStats(teamId.value, { season: selectedSeason.value }),
          teamsAPI.getTeamFixtures(teamId.value, { season: selectedSeason.value, last: 10 }),
          teamsAPI.getTeamPlayers(teamId.value, { season: selectedSeason.value }),
          fixturesAPI.getTeamForm(teamId.value, { season: selectedSeason.value, last: 10 })
        ])
        
        // Fetch standings data separately
        await fetchStandings()
        
        console.log('🔍 TeamDetail Debug - API responses:', {
          teamData: JSON.stringify(teamData, null, 2),
          teamStatsData: JSON.stringify(teamStatsData, null, 2),
          fixturesData: JSON.stringify(fixturesData, null, 2),
          playersData: JSON.stringify(playersData, null, 2),
          formData: JSON.stringify(formData, null, 2)
        })
        
        console.log('🔍 TeamDetail Debug - Processing team data:', {
          teamDataStructure: {
            hasData: !!teamData,
            hasResponse: !!teamData?.response,
            dataType: typeof teamData,
            keys: teamData ? Object.keys(teamData) : []
          },
          teamStatsStructure: {
            hasData: !!teamStatsData,
            hasResponse: !!teamStatsData?.response,
            dataType: typeof teamStatsData,
            keys: teamStatsData ? Object.keys(teamStatsData) : []
          }
        })
        
        // Validate team data structure
        if (teamData && typeof teamData === 'object') {
          // Handle different API response structures
          if (teamData.response && Array.isArray(teamData.response) && teamData.response[0]) {
            // Response array structure - extract team and venue data
            const responseItem = teamData.response[0]
            team.value = {
              ...responseItem.team, // Spread team properties (id, name, code, country, founded, logo)
              venue_name: responseItem.venue?.name,
              venue_address: responseItem.venue?.address,
              venue_city: responseItem.venue?.city,
              venue_capacity: responseItem.venue?.capacity,
              venue_surface: responseItem.venue?.surface,
              venue_image: responseItem.venue?.image
            }
          } else if (teamData.team) {
            // Nested team structure
            team.value = teamData.team
          } else {
            // Direct team object
            team.value = teamData
          }
          
          // Set team statistics separately if available
          if (teamStatsData && typeof teamStatsData === 'object') {
            if (teamStatsData.response && Array.isArray(teamStatsData.response)) {
              team.value.statistics = teamStatsData.response
            } else if (teamStatsData.response && typeof teamStatsData.response === 'object') {
              // Handle case where response is an object, not an array
              team.value.statistics = [teamStatsData.response]
            } else {
              team.value.statistics = [teamStatsData]
            }
          } else {
            team.value.statistics = []
          }
          
                  console.log('🔍 TeamDetail Debug - Final team value:', {
          team: team.value,
          hasTeam: !!team.value,
          teamKeys: team.value ? Object.keys(team.value) : [],
          hasStatistics: !!team.value?.statistics,
          statisticsLength: team.value?.statistics?.length,
          statisticsStructure: team.value?.statistics ? team.value.statistics.map(s => ({
            hasLeague: !!s.league,
            leagueId: s.league?.id,
            leagueName: s.league?.name,
            hasGoals: !!s.goals,
            hasFixtures: !!s.fixtures,
            hasCards: !!s.cards
          })) : [],
          venueData: {
            name: team.value?.venue_name,
            city: team.value?.venue_city,
            capacity: team.value?.venue_capacity
          }
        })
        
        console.log('🔍 TeamDetail Debug - Processed data:', {
          fixtures: {
            original: fixturesData,
            processed: recentFixtures.value,
            length: recentFixtures.value.length
          },
          players: {
            original: playersData,
            processed: teamPlayers.value,
            length: teamPlayers.value.length
          },
          form: {
            original: formData,
            processed: teamForm.value,
            length: teamForm.value.length
          }
        })
      } else {
          console.warn('Invalid team data structure:', teamData)
          team.value = null
          error.value = 'Invalid team data received from server.'
          return
        }
        
        // Validate other data
        if (fixturesData && typeof fixturesData === 'object') {
          if (fixturesData.response && Array.isArray(fixturesData.response)) {
            recentFixtures.value = fixturesData.response
          } else if (fixturesData.response && typeof fixturesData.response === 'object') {
            recentFixtures.value = [fixturesData.response]
          } else if (Array.isArray(fixturesData)) {
            recentFixtures.value = fixturesData
          } else {
            recentFixtures.value = []
          }
        } else {
          recentFixtures.value = []
        }
        
        if (playersData && typeof playersData === 'object') {
          if (playersData.response && Array.isArray(playersData.response)) {
            teamPlayers.value = playersData.response
          } else if (playersData.response && typeof playersData.response === 'object') {
            teamPlayers.value = [playersData.response]
          } else if (Array.isArray(playersData)) {
            teamPlayers.value = playersData
          } else {
            teamPlayers.value = []
          }
        } else {
          teamPlayers.value = []
        }
        
        if (formData && typeof formData === 'object') {
          if (formData.response && Array.isArray(formData.response)) {
            teamForm.value = formData.response
          } else if (formData.response && typeof formData.response === 'object') {
            teamForm.value = [formData.response]
          } else if (Array.isArray(formData)) {
            teamForm.value = formData
          } else {
            teamForm.value = []
          }
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

    const viewFixture = (fixtureId) => {
      router.push(`/fixtures/${fixtureId}`)
    }

    const viewPlayer = (playerId) => {
      router.push(`/players/${playerId}`)
    }

    // Helper functions
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

    const getTotalCards = (cardsData) => {
      if (!cardsData || typeof cardsData !== 'object') return 0
      
      // Sum up all the total values from the time-based breakdown
      let total = 0
      for (const timeSlot in cardsData) {
        if (cardsData[timeSlot]?.total && typeof cardsData[timeSlot].total === 'number') {
          total += cardsData[timeSlot].total
        }
      }
      return total
    }

    onMounted(() => {
      fetchTeamData()
    })

    return {
      teamId,
      team,
      recentFixtures,
      teamPlayers,
      teamForm,
      standings,
      loading,
      error,
      selectedSeason,
      teamStats,
      fetchTeamData,
      fetchStandings,
      getTeamPosition,
      getTeamPoints,
      viewFixture,
      viewPlayer,
      getFormResultClass,
      getFormResultTitle,
      getStatusClass,
      getStatusText,
      formatDate,
      getTotalCards
    }
  }
}
</script>
