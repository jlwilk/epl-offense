<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Premier League Standings</h1>
        <p class="text-gray-600 mt-2">Current league table and team rankings</p>
      </div>

      <!-- Season Selector -->
      <div class="flex items-center space-x-4 mt-4 sm:mt-0">
        <label class="text-sm font-medium text-gray-700">Season:</label>
        <select
          v-model.number="selectedSeason"
          @change="fetchStandings"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
        >
          <option :value="2025">2025</option>
          <option :value="2024">2024</option>
          <option :value="2023">2023</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading standings...</p>
    </div>



    <!-- Content States -->
    <div v-if="!loading">
      <!-- Error State -->
      <div v-if="error" class="card text-center py-12">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Standings</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="fetchStandings" class="btn-primary">Try Again</button>
      </div>

      <!-- Standings Table OR Empty State -->
      <template v-else>
        <template v-if="standings.length > 0">
          <div class="card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(team, index) in standings"
                    :key="team?.team?.id ?? index"
                    :class="[
                      'hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                      getPositionClass(team.rank)
                    ]"
                    @click="team?.team?.id && viewTeam(team.team.id)"
                  >
                    <!-- Position -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span 
                          :class="[
                            'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                            getPositionBadgeClass(team.rank)
                          ]"
                        >
                          {{ team.rank }}
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
                      {{ team.all.played }}
                    </td>

                    <!-- Wins -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <span class="font-medium text-epl-green">{{ team.all.win }}</span>
                    </td>

                    <!-- Draws -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <span class="font-medium text-epl-gold">{{ team.all.draw }}</span>
                    </td>

                    <!-- Losses -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <span class="font-medium text-epl-red">{{ team.all.lose }}</span>
                    </td>

                    <!-- Goals For -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <span class="font-medium text-epl-blue">{{ team.all.goals.for }}</span>
                    </td>

                    <!-- Goals Against -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <span class="font-medium text-epl-purple">{{ team.all.goals.against }}</span>
                    </td>

                    <!-- Goal Difference -->
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span 
                        :class="[
                          'font-medium',
                          team.goalsDiff > 0 ? 'text-epl-green' : team.goalsDiff < 0 ? 'text-epl-red' : 'text-gray-900'
                        ]"
                      >
                        {{ team.goalsDiff > 0 ? '+' : '' }}{{ team.goalsDiff }}
                      </span>
                    </td>

                    <!-- Points -->
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-epl-blue text-white">
                        {{ team.points }}
                      </span>
                    </td>

                    <!-- Form -->
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="flex items-center justify-center space-x-1">
                        <span
                          v-for="(result, formIndex) in (team.form ? team.form.slice(-5) : '')"
                          :key="formIndex"
                          :class="[
                            'w-3 h-3 rounded-full',
                            getFormResultClass(result)
                          ]"
                          :title="getFormResultTitle(result)"
                        ></span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
        <div v-else class="card text-center py-12">
          <div class="text-6xl mb-4">🏆</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Standings Available</h3>
          <p class="text-gray-600">Standings data is not available for the selected season.</p>
        </div>
      </template>
    </div>

    <!-- League Info -->
    <div v-if="leagueInfo" class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">League Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-epl-blue">{{ leagueInfo.name }}</div>
          <div class="text-sm text-gray-500">League</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-epl-purple">{{ leagueInfo.country }}</div>
          <div class="text-sm text-gray-500">Country</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-epl-gold">{{ selectedSeason }}</div>
          <div class="text-sm text-gray-500">Season</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { standingsAPI } from '../services/api'

export default {
  name: 'Standings',
  setup() {
    const router = useRouter()
    const standings = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedSeason = ref(2025)
    const leagueInfo = ref(null)

    const fetchStandings = async () => {
      loading.value = true
      error.value = null

      try {
                const data = await standingsAPI.getStandings({ season: selectedSeason.value })
        
        if (data && data.league) {
          // API returns standings directly as {league: {...}}
          const table = data.league?.standings?.[0] || []
          standings.value = table
          leagueInfo.value = data.league || null
        } else if (data && data.response) {
          // Fallback for response structure
          const table = data.response?.[0]?.league?.standings?.[0] || []
          standings.value = table
          leagueInfo.value = data.response?.[0]?.league || null
        } else {
          standings.value = []
          leagueInfo.value = null
        }
      } catch (err) {
        console.error('Error fetching standings:', err)
        error.value = 'Failed to load standings. Please try again.'
        standings.value = []
        leagueInfo.value = null
      } finally {
        loading.value = false
      }
    }

    const viewTeam = (teamId) => {
      router.push(`/teams/${teamId}`)
    }

    // Helper functions for styling
    const getPositionClass = (rank) => {
      if (rank <= 4) return 'bg-green-50 border-l-4 border-epl-green'
      if (rank <= 6) return 'bg-blue-50 border-l-4 border-epl-blue'
      if (rank >= 18) return 'bg-red-50 border-l-4 border-epl-red'
      return ''
    }

    const getPositionBadgeClass = (rank) => {
      if (rank <= 4) return 'bg-epl-green text-white'
      if (rank <= 6) return 'bg-epl-blue text-white'
      if (rank >= 18) return 'bg-epl-red text-white'
      return 'bg-gray-200 text-gray-700'
    }

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

    onMounted(() => {
      fetchStandings()
    })

    return {
      standings,
      loading,
      error,
      selectedSeason,
      leagueInfo,
      fetchStandings,
      viewTeam,
      getPositionClass,
      getPositionBadgeClass,
      getFormResultClass,
      getFormResultTitle
    }
  }
}
</script>
