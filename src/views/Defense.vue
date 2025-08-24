<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Defensive Statistics</h1>
        <p class="text-gray-600 mt-2">Team defensive performance and clean sheet analysis</p>
      </div>
      
      <!-- Season Selector -->
      <div class="flex items-center space-x-4 mt-4 sm:mt-0">
        <label class="text-sm font-medium text-gray-700">Season:</label>
        <select
          v-model="selectedSeason"
          @change="fetchDefenseData"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
    </div>

    <!-- Defense Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ defenseStats.totalTeams || '20' }}</div>
          <div class="text-blue-100">Total Teams</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ defenseStats.avgGoalsConceded || '0' }}</div>
          <div class="text-blue-100">Avg Goals Conceded</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ defenseStats.totalCleanSheets || '0' }}</div>
          <div class="text-blue-100">Total Clean Sheets</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ defenseStats.bestDefense || 'N/A' }}</div>
          <div class="text-blue-100">Best Defense</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading defensive statistics...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Defense Data</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchDefenseData" class="btn-primary">Try Again</button>
    </div>

    <!-- Defense Table -->
    <div v-else-if="defenseData.length > 0" class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                MP
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                GA
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                CS
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tackles
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interceptions
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blocks
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clearances
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(team, index) in defenseData"
              :key="team.team.id"
              :class="[
                'hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                getDefenseRankClass(index + 1)
              ]"
              @click="viewTeam(team.team.id)"
            >
              <!-- Rank -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span 
                    :class="[
                      'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                      getDefenseRankBadgeClass(index + 1)
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
              </td>
              
              <!-- Team -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-full flex items-center justify-center mr-3">
                    <span class="text-white text-sm font-bold">
                      {{ team?.team?.name?.charAt(0) || 'T' }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ team?.team?.name || 'Team Name' }}</div>
                    <div class="text-sm text-gray-500">{{ team?.team?.country || 'England' }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Matches Played -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                {{ team.statistics?.games?.appearences || 0 }}
              </td>
              
              <!-- Goals Against -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-epl-red">{{ team.statistics?.goals?.against?.total || 0 }}</span>
              </td>
              
              <!-- Clean Sheets -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-epl-green">{{ team.statistics?.clean_sheets || 0 }}</span>
              </td>
              
              <!-- Tackles -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-epl-blue">{{ team.statistics?.tackles?.total || 0 }}</span>
              </td>
              
              <!-- Interceptions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-epl-purple">{{ team.statistics?.interceptions || 0 }}</span>
              </td>
              
              <!-- Blocks -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-epl-gold">{{ team.statistics?.blocks || 0 }}</span>
              </td>
              
              <!-- Clearances -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <span class="font-medium text-gray-600">{{ team.statistics?.clearances || 0 }}</span>
              </td>
              
              <!-- Rating -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getRatingClass(team.statistics?.rating || 0)
                  ]"
                >
                  {{ (team.statistics?.rating || 0).toFixed(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <div class="text-6xl mb-4">🛡️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Defense Data Available</h3>
      <p class="text-gray-600">Defensive statistics are not available for the selected season.</p>
    </div>

    <!-- Defensive Insights -->
    <div v-if="defenseData.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Clean Sheets Analysis -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Clean Sheets Analysis</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Teams with 10+ Clean Sheets:</span>
            <span class="font-medium text-epl-green">
              {{ getTeamsWithCleanSheets(10) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Teams with 5-9 Clean Sheets:</span>
            <span class="font-medium text-epl-blue">
              {{ getTeamsWithCleanSheets(5, 9) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Teams with 0-4 Clean Sheets:</span>
            <span class="font-medium text-epl-red">
              {{ getTeamsWithCleanSheets(0, 4) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Goals Against Analysis -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Goals Against Analysis</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Best Defense (≤20 goals):</span>
            <span class="font-medium text-epl-green">
              {{ getTeamsByGoalsAgainst(0, 20) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Average Defense (21-40 goals):</span>
            <span class="font-medium text-epl-blue">
              {{ getTeamsByGoalsAgainst(21, 40) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Poor Defense (41+ goals):</span>
            <span class="font-medium text-epl-red">
              {{ getTeamsByGoalsAgainst(41, 999) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Defensive Players -->
    <div v-if="topDefensivePlayers.length > 0" class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Defensive Players</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="player in topDefensivePlayers.slice(0, 6)"
          :key="player.player.id"
          class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          @click="viewPlayer(player.player.id)"
        >
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-epl-green to-epl-blue rounded-full flex items-center justify-center">
              <span class="text-white text-lg font-bold">
                {{ player.player.name.charAt(0) }}
              </span>
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ player.player.name }}</div>
              <div class="text-sm text-gray-500">{{ player.statistics[0]?.team?.name }}</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-epl-green">
                {{ getDefensiveStat(player) }}
              </div>
              <div class="text-xs text-gray-500">{{ getDefensiveStatType() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { defenseAPI, playerStatsAPI } from '../services/api'

export default {
  name: 'Defense',
  setup() {
    const router = useRouter()
    const defenseData = ref([])
    const topDefensivePlayers = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedSeason = ref(2025)
    const defenseStats = ref({
      totalTeams: 0,
      avgGoalsConceded: 0,
      totalCleanSheets: 0,
      bestDefense: 'N/A'
    })

    const fetchDefenseData = async () => {
      loading.value = true
      error.value = null
      
      try {
        const [defenseTable, defensiveLeaders] = await Promise.all([
          defenseAPI.getDefenseTable({ season: selectedSeason.value }),
          playerStatsAPI.getDefensiveLeaders(39, selectedSeason.value, { limit: 10 })
        ])
        
        if (defenseTable && defenseTable.response) {
          defenseData.value = defenseTable.response
        } else {
          defenseData.value = Array.isArray(defenseTable) ? defenseTable : []
        }
        
        if (defensiveLeaders && defensiveLeaders.response) {
          topDefensivePlayers.value = defensiveLeaders.response
        } else {
          topDefensivePlayers.value = Array.isArray(defensiveLeaders) ? defensiveLeaders : []
        }
        
        updateDefenseStats()
      } catch (err) {
        console.error('Error fetching defense data:', err)
        error.value = 'Failed to load defense data. Please try again.'
        defenseData.value = []
        topDefensivePlayers.value = []
      } finally {
        loading.value = false
      }
    }

    const updateDefenseStats = () => {
      if (defenseData.value.length > 0) {
        const totalGoals = defenseData.value.reduce((sum, team) => 
          sum + (team.statistics?.goals?.against?.total || 0), 0
        )
        const totalCleanSheets = defenseData.value.reduce((sum, team) => 
          sum + (team.statistics?.clean_sheets || 0), 0
        )
        
        defenseStats.value = {
          totalTeams: defenseData.value.length,
          avgGoalsConceded: (totalGoals / defenseData.value.length).toFixed(1),
          totalCleanSheets: totalCleanSheets,
          bestDefense: defenseData.value[0]?.team?.name || 'N/A'
        }
      }
    }

    const viewTeam = (teamId) => {
      router.push(`/teams/${teamId}`)
    }

    const viewPlayer = (playerId) => {
      router.push(`/players/${playerId}`)
    }

    // Helper functions for styling
    const getDefenseRankClass = (rank) => {
      if (rank <= 5) return 'bg-green-50 border-l-4 border-epl-green'
      if (rank <= 10) return 'bg-blue-50 border-l-4 border-epl-blue'
      if (rank >= 16) return 'bg-red-50 border-l-4 border-epl-red'
      return ''
    }

    const getDefenseRankBadgeClass = (rank) => {
      if (rank <= 5) return 'bg-epl-green text-white'
      if (rank <= 10) return 'bg-epl-blue text-white'
      if (rank >= 16) return 'bg-epl-red text-white'
      return 'bg-gray-200 text-gray-700'
    }

    const getRatingClass = (rating) => {
      if (rating >= 7.5) return 'bg-epl-green text-white'
      if (rating >= 6.5) return 'bg-epl-blue text-white'
      if (rating >= 5.5) return 'bg-epl-gold text-white'
      return 'bg-epl-red text-white'
    }

    // Analysis helper functions
    const getTeamsWithCleanSheets = (min, max = 999) => {
      return defenseData.value.filter(team => {
        const cleanSheets = team.statistics?.clean_sheets || 0
        return cleanSheets >= min && cleanSheets <= max
      }).length
    }

    const getTeamsByGoalsAgainst = (min, max) => {
      return defenseData.value.filter(team => {
        const goalsAgainst = team.statistics?.goals?.against?.total || 0
        return goalsAgainst >= min && goalsAgainst <= max
      }).length
    }

    const getDefensiveStat = (player) => {
      const stats = player.statistics[0]
      return stats?.tackles?.total || stats?.interceptions || stats?.blocks || stats?.clean_sheets || 0
    }

    const getDefensiveStatType = () => {
      return 'Tackles' // This could be dynamic based on the stat type filter
    }

    onMounted(() => {
      fetchDefenseData()
    })

    return {
      defenseData,
      topDefensivePlayers,
      loading,
      error,
      selectedSeason,
      defenseStats,
      fetchDefenseData,
      viewTeam,
      viewPlayer,
      getDefenseRankClass,
      getDefenseRankBadgeClass,
      getRatingClass,
      getTeamsWithCleanSheets,
      getTeamsByGoalsAgainst,
      getDefensiveStat,
      getDefensiveStatType
    }
  }
}
</script>
