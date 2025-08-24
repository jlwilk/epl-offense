<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading player details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Player</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchPlayerData" class="btn-primary">Try Again</button>
    </div>

    <!-- Player Details -->
    <div v-else-if="player" class="space-y-6">
      <!-- Player Header -->
      <div class="card">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- Player Avatar -->
          <div class="w-32 h-32 rounded-full overflow-hidden">
            <img 
              v-if="player?.photo || player?.player?.photo" 
              :src="player?.photo || player?.player?.photo" 
              :alt="player?.name || player?.player?.name || 'Player'"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-epl-gold to-epl-red flex items-center justify-center"
            >
              <span class="text-white text-4xl font-bold">
                {{ (player?.name || player?.player?.name || 'P')?.charAt(0) }}
              </span>
            </div>
          </div>
          
          <!-- Player Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ player?.name || player?.player?.name || 'Player Name' }}</h1>
            <div class="space-y-2 text-gray-600">
              <div class="flex flex-wrap justify-center md:justify-start gap-4">
                <span><strong>Age:</strong> {{ player?.age || player?.player?.age || 'N/A' }}</span>
                <span><strong>Nationality:</strong> {{ player?.nationality || player?.player?.nationality || 'N/A' }}</span>
                <span><strong>Height:</strong> {{ player?.height || player?.player?.height || 'N/A' }}</span>
                <span><strong>Weight:</strong> {{ player?.weight || player?.player?.weight || 'N/A' }}</span>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                <span><strong>Team:</strong> {{ player?.statistics?.[0]?.team?.name || 'N/A' }}</span>
                <!-- Team Logo -->
                <img 
                  v-if="player?.statistics?.[0]?.team?.logo" 
                  :src="player.statistics[0].team.logo" 
                  :alt="player.statistics[0].team.name"
                  class="w-6 h-6 rounded-full"
                  @error="$event.target.style.display='none'"
                />
                <span><strong>Position:</strong> {{ player?.statistics?.[0]?.games?.position || 'N/A' }}</span>
                <span><strong>Number:</strong> {{ player?.statistics?.[0]?.games?.number || 'N/A' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Season Selector -->
          <div class="flex flex-col items-center space-y-2">
            <label class="text-sm font-medium text-gray-700">Season:</label>
            <select
              v-model="selectedSeason"
              @change="fetchPlayerData"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            >
              <option v-for="season in availableSeasons" :key="season" :value="season">
                {{ season }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ playerStats.appearances || '0' }}</div>
            <div class="text-blue-100">Appearances</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ playerStats.goals || '0' }}</div>
            <div class="text-blue-100">Goals</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ playerStats.assists || '0' }}</div>
            <div class="text-blue-100">Assists</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="text-center">
            <div class="text-3xl font-bold">{{ playerStats.rating || '0.0' }}</div>
            <div class="text-blue-100">Rating</div>
          </div>
        </div>
      </div>

      <!-- Player Statistics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Goals and Assists -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Goals & Assists</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-epl-red">{{ playerStats.goals || 0 }}</div>
                <div class="text-sm text-gray-500">Total Goals</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-epl-blue">{{ playerStats.assists || 0 }}</div>
                <div class="text-sm text-gray-500">Total Assists</div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Goal Details:</div>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-lg font-bold text-epl-green">{{ playerStats.goalsHome || 0 }}</div>
                  <div class="text-xs text-gray-500">Home</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-epl-purple">{{ playerStats.goalsAway || 0 }}</div>
                  <div class="text-xs text-gray-500">Away</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-epl-gold">{{ playerStats.penalties || 0 }}</div>
                  <div class="text-xs text-gray-500">Penalties</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Games and Minutes -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Games & Minutes</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-epl-blue">{{ playerStats.appearances || 0 }}</div>
                <div class="text-sm text-gray-500">Appearances</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-epl-purple">{{ playerStats.minutes || 0 }}</div>
                <div class="text-sm text-gray-500">Minutes</div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Game Details:</div>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-lg font-bold text-epl-green">{{ playerStats.starts || 0 }}</div>
                  <div class="text-xs text-gray-500">Starts</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-epl-gold">{{ playerStats.subs || 0 }}</div>
                  <div class="text-xs text-gray-500">Subs</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-epl-red">{{ playerStats.yellowCards || 0 }}</div>
                  <div class="text-xs text-gray-500">Yellow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Statistics -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Passing -->
          <div class="text-center">
            <h4 class="font-medium text-gray-700 mb-3">Passing</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Passes:</span>
                <span class="font-medium">{{ playerStats.totalPasses || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Key Passes:</span>
                <span class="font-medium">{{ playerStats.keyPasses || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Pass Accuracy:</span>
                <span class="font-medium">{{ playerStats.passAccuracy || 0 }}%</span>
              </div>
            </div>
          </div>

          <!-- Shooting -->
          <div class="text-center">
            <h4 class="font-medium text-gray-700 mb-3">Shooting</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Shots:</span>
                <span class="font-medium">{{ playerStats.totalShots || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Shots on Target:</span>
                <span class="font-medium">{{ playerStats.shotsOnTarget || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Shot Accuracy:</span>
                <span class="font-medium">{{ playerStats.shotAccuracy || 0 }}%</span>
              </div>
            </div>
          </div>

          <!-- Defensive -->
          <div class="text-center">
            <h4 class="font-medium text-gray-700 mb-3">Defensive</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Tackles:</span>
                <span class="font-medium">{{ playerStats.tackles || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Interceptions:</span>
                <span class="font-medium">{{ playerStats.interceptions || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Blocks:</span>
                <span class="font-medium">{{ playerStats.blocks || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Season Comparison -->
      <div v-if="seasonComparison.length > 0" class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Season Comparison</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Apps</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="season in seasonComparison"
                :key="season.season"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ season.season }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {{ season.appearances || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  <span class="font-medium text-epl-red">{{ season.goals || 0 }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  <span class="font-medium text-epl-blue">{{ season.assists || 0 }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getRatingClass(Number(season.rating) || 0)
                    ]"
                  >
                    {{ (Number(season.rating) || 0).toFixed(1) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { playerStatsAPI } from '../services/api'

export default {
  name: 'PlayerDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const playerId = computed(() => props.id || route.params.id)
    
    const player = ref(null)
    const seasonComparison = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedSeason = ref(2025)
    const availableSeasons = ref([2025, 2024, 2023])

    const playerStats = computed(() => {
      if (!player.value?.statistics?.[0]) return {}
      
      const stats = player.value.statistics[0]
      return {
        appearances: stats.games?.appearences || 0,
        goals: stats.goals?.total || 0,
        assists: stats.goals?.assists || 0,
        rating: stats.games?.rating || 0,
        goalsHome: stats.goals?.home || 0,
        goalsAway: stats.goals?.away || 0,
        penalties: stats.penalties?.scored || 0,
        minutes: stats.games?.minutes || 0,
        starts: stats.games?.lineups || 0,
        subs: stats.games?.substitutes || 0,
        yellowCards: stats.cards?.yellow || 0,
        redCards: stats.cards?.red || 0,
        totalPasses: stats.passes?.total || 0,
        keyPasses: stats.passes?.key || 0,
        passAccuracy: stats.passes?.accuracy || 0,
        totalShots: stats.shots?.total || 0,
        shotsOnTarget: stats.shots?.on || 0,
        shotAccuracy: stats.shots?.total > 0 ? Math.round((stats.shots.on / stats.shots.total) * 100) : 0,
        tackles: stats.tackles?.total || 0,
        interceptions: stats.tackles?.interceptions || 0,
        blocks: stats.tackles?.blocks || 0
      }
    })

    const fetchPlayerData = async () => {
      loading.value = true
      error.value = null
      
      try {
        const seasonParams = { season: selectedSeason.value }
        // Make the API call with season parameter
        const playerData = await playerStatsAPI.getPlayerStats(playerId.value, seasonParams)
        const seasonsData = await playerStatsAPI.getPlayerSeasons(playerId.value)
        
        // Handle different API response structures
        console.log('🔍 PlayerDetail Debug - Processing player data:', {
          playerData,
          hasResponse: !!playerData?.response,
          responseLength: playerData?.response?.length,
          hasPlayer: !!playerData?.player,
          playerDataKeys: playerData ? Object.keys(playerData) : []
        })
        
        if (playerData && playerData.response && playerData.response.length > 0) {
          // Handle response structure with data
          player.value = playerData.response[0]
          console.log('🔍 PlayerDetail Debug - Set player from response array:', player.value)
        } else if (playerData && playerData.player) {
          // Handle single player object (unwrapped by interceptor)
          player.value = playerData
          console.log('🔍 PlayerDetail Debug - Set player from player object:', player.value)
        } else if (playerData) {
          // Handle direct player object
          player.value = playerData
          console.log('🔍 PlayerDetail Debug - Set player from direct data:', player.value)
        } else {
          player.value = null
          console.log('🔍 PlayerDetail Debug - No player data available')
        }
        
        console.log('🔍 PlayerDetail Debug - Final player value:', {
          player: player.value,
          hasPlayer: !!player.value,
          playerKeys: player.value ? Object.keys(player.value) : [],
          hasStatistics: !!player.value?.statistics,
          statisticsLength: player.value?.statistics?.length
        })
        
        if (seasonsData && seasonsData.response) {
          // Handle response structure - seasons are direct numbers, not objects
          if (Array.isArray(seasonsData.response) && seasonsData.response.length > 0) {
            // Check if response contains direct season numbers or objects with season property
            if (typeof seasonsData.response[0] === 'number') {
              // Direct season numbers
              availableSeasons.value = seasonsData.response
                .filter(season => season !== undefined && season !== null)
                .sort((a, b) => b - a)
            } else {
              // Objects with season property
              availableSeasons.value = seasonsData.response
                .map(s => s.season)
                .filter(season => season !== undefined && season !== null)
                .sort((a, b) => b - a)
            }
          } else {
            availableSeasons.value = [2025, 2024, 2023]
          }
        } else if (seasonsData && Array.isArray(seasonsData)) {
          availableSeasons.value = seasonsData
            .filter(season => season !== undefined && season !== null)
            .sort((a, b) => b - a)
        } else {
          // Fallback to default seasons if API doesn't return season data
          availableSeasons.value = [2025, 2024, 2023]
        }
        
        // Only get comparison data for seasons that have data (avoid 422 errors)
        const validSeasons = availableSeasons.value.filter(season => season !== selectedSeason.value).slice(0, 2)
        
        if (validSeasons.length > 0) {
          try {
            const comparisonPromises = validSeasons.map(season =>
              playerStatsAPI.getPlayerStats(playerId.value, { season }).catch(err => {
                console.log(`Skipping comparison for season ${season} due to error:`, err.message)
                return null
              })
            )
            
            const comparisonData = await Promise.all(comparisonPromises)
            seasonComparison.value = comparisonData
              .map((data, index) => {
                if (data === null) return null
                return {
                  season: validSeasons[index],
                  appearances: data.statistics?.[0]?.games?.appearences || 0,
                  goals: data.statistics?.[0]?.goals?.total || 0,
                  assists: data.statistics?.[0]?.goals?.assists || 0,
                  rating: data.statistics?.[0]?.games?.rating || 0
                }
              })
              .filter(item => item !== null)
          } catch (err) {
            console.log('Error fetching comparison data, continuing without it:', err.message)
            seasonComparison.value = []
          }
        } else {
          seasonComparison.value = []
        }
        
      } catch (err) {
        console.error('Error fetching player data:', err)
        error.value = 'Failed to load player data. Please try again.'
        player.value = null
      } finally {
        loading.value = false
      }
    }

    // Helper functions
    const getRatingClass = (rating) => {
      if (rating >= 7.5) return 'bg-epl-green text-white'
      if (rating >= 6.5) return 'bg-epl-blue text-white'
      if (rating >= 5.5) return 'bg-epl-gold text-white'
      return 'bg-epl-red text-white'
    }

    onMounted(() => {
      fetchPlayerData()
    })

    return {
      playerId,
      player,
      seasonComparison,
      loading,
      error,
      selectedSeason,
      availableSeasons,
      playerStats,
      fetchPlayerData,
      getRatingClass
    }
  }
}
</script>
