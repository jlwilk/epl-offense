<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-gradient-to-br from-epl-blue/5 via-epl-purple/5 to-epl-gold/5 py-8 md:py-12">
      <div class="absolute inset-0 bg-pattern opacity-30"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="text-center lg:text-left mb-6 lg:mb-0">
            <div class="flex items-center justify-center lg:justify-start space-x-2 md:space-x-3 mb-3 md:mb-4">
              <div class="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-epl-blue to-epl-purple rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white text-sm md:text-xl">🏆</span>
              </div>
              <div>
                <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-gradient">Premier League</h1>
                <h2 class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-700">Standings</h2>
              </div>
            </div>
            <p class="text-sm md:text-xl text-gray-600 max-w-2xl">Current league table and team rankings for the {{ selectedSeason }}/{{ selectedSeason + 1 }} season</p>
          </div>

          <!-- Season Selector -->
          <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <label class="text-sm md:text-lg font-semibold text-gray-700">Season:</label>
            <select
              v-model.number="selectedSeason"
              @change="fetchStandings"
              class="px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-sm md:text-lg"
            >
              <option :value="2025">2025/26</option>
              <option :value="2024">2024/25</option>
              <option :value="2023">2023/24</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8 md:py-16">
        <div class="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-epl-blue mx-auto mb-4 md:mb-6"></div>
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">Loading Standings</h3>
        <p class="text-sm md:text-base text-gray-600">Fetching the latest Premier League table...</p>
      </div>

      <!-- Content States -->
      <div v-if="!loading">
        <!-- Error State -->
        <div v-if="error" class="card-enhanced text-center py-8 md:py-16">
          <div class="text-6xl md:text-8xl mb-4 md:mb-6">⚠️</div>
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Error Loading Standings</h3>
          <p class="text-sm md:text-lg text-gray-600 mb-6 md:mb-8">{{ error }}</p>
          <button @click="fetchStandings" class="btn-primary text-sm md:text-lg px-6 md:px-8 py-2 md:py-3">
            Try Again
          </button>
        </div>

        <!-- Standings Table OR Empty State -->
        <template v-else>
          <template v-if="standings.length > 0">
            <!-- Desktop Table View -->
            <div class="hidden lg:block card-enhanced overflow-hidden">
              <div class="p-6 border-b border-gray-200">
                <h3 class="text-2xl font-bold text-gray-900">League Table</h3>
                <p class="text-gray-600 mt-1">Current standings for {{ selectedSeason }}/{{ selectedSeason + 1 }} season</p>
              </div>
              
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pos</th>
                      <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Team</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">P</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">W</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">D</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">L</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GF</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GA</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">GD</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Pts</th>
                      <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Form</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(team, index) in standings"
                      :key="team?.team?.id ?? index"
                      :class="[
                        'hover:bg-gray-50 transition-all duration-200 cursor-pointer group',
                        getPositionClass(team.rank)
                      ]"
                      @click="team?.team?.id && viewTeam(team.team.id)"
                    >
                      <!-- Position -->
                      <td class="px-6 py-6 whitespace-nowrap">
                        <div class="flex items-center">
                          <span 
                            :class="[
                              'inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shadow-md',
                              getPositionBadgeClass(team.rank)
                            ]"
                          >
                            {{ team.rank }}
                          </span>
                        </div>
                      </td>

                      <!-- Team -->
                      <td class="px-6 py-6 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-12 h-12 rounded-xl overflow-hidden mr-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                            <img 
                              v-if="getTeamLogo(team?.team?.name)" 
                              :src="getTeamLogo(team?.team?.name)" 
                              :alt="team?.team?.name || 'Team'"
                              class="w-full h-full object-cover"
                              @error="$event.target.style.display='none'"
                            />
                            <div 
                              v-else
                              class="w-full h-full bg-gradient-to-br from-epl-blue to-epl-purple flex items-center justify-center"
                            >
                              <span class="text-white text-lg font-bold">
                                {{ team?.team?.name?.charAt(0) || 'T' }}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div class="text-lg font-bold text-gray-900 group-hover:text-epl-blue transition-colors duration-200">
                              {{ team?.team?.name || 'Team Name' }}
                            </div>
                            <div class="text-sm text-gray-500">{{ team?.team?.country || 'England' }}</div>
                          </div>
                        </div>
                      </td>

                      <!-- Matches Played -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-gray-900">{{ team.all.played }}</span>
                      </td>

                      <!-- Wins -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-epl-green">{{ team.all.win }}</span>
                      </td>

                      <!-- Draws -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-epl-gold">{{ team.all.draw }}</span>
                      </td>

                      <!-- Losses -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-epl-red">{{ team.all.lose }}</span>
                      </td>

                      <!-- Goals For -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-epl-blue">{{ team.all.goals.for }}</span>
                      </td>

                      <!-- Goals Against -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="text-lg font-bold text-epl-purple">{{ team.all.goals.against }}</span>
                      </td>

                      <!-- Goal Difference -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span 
                          :class="[
                            'text-lg font-bold px-3 py-1 rounded-full',
                            team.goalsDiff > 0 ? 'bg-green-100 text-epl-green' : team.goalsDiff < 0 ? 'bg-red-100 text-epl-red' : 'bg-gray-100 text-gray-900'
                          ]"
                        >
                          {{ team.goalsDiff > 0 ? '+' : '' }}{{ team.goalsDiff }}
                        </span>
                      </td>

                      <!-- Points -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <span class="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-epl-blue to-epl-purple text-white shadow-lg">
                          {{ team.points }}
                        </span>
                      </td>

                      <!-- Form -->
                      <td class="px-6 py-6 whitespace-nowrap text-center">
                        <div class="flex items-center justify-center space-x-1">
                          <span
                            v-for="(result, formIndex) in (team.form ? team.form.slice(-5) : '')"
                            :key="formIndex"
                            :class="[
                              'w-4 h-4 rounded-full shadow-sm',
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

            <!-- Mobile/Tablet Card View -->
            <div class="lg:hidden space-y-4">
              <div class="card-enhanced">
                <div class="p-4 border-b border-gray-200">
                  <h3 class="text-xl font-bold text-gray-900">League Table</h3>
                  <p class="text-sm text-gray-600">Current standings for {{ selectedSeason }}/{{ selectedSeason + 1 }} season</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <div
                  v-for="(team, index) in standings"
                  :key="team?.team?.id ?? index"
                  :class="[
                    'card-enhanced p-4 cursor-pointer transition-all duration-200 hover:shadow-lg',
                    getPositionClass(team.rank)
                  ]"
                  @click="team?.team?.id && viewTeam(team.team.id)"
                >
                  <!-- Header Row -->
                  <div class="flex items-center justify-between mb-3">
                    <!-- Position and Team -->
                    <div class="flex items-center space-x-3">
                      <span 
                        :class="[
                          'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-md',
                          getPositionBadgeClass(team.rank)
                        ]"
                      >
                        {{ team.rank }}
                      </span>
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-lg overflow-hidden">
                          <img 
                            v-if="getTeamLogo(team?.team?.name)" 
                            :src="getTeamLogo(team?.team?.name)" 
                            :alt="team?.team?.name || 'Team'"
                            class="w-full h-full object-cover"
                            @error="$event.target.style.display='none'"
                          />
                          <div 
                            v-else
                            class="w-full h-full bg-gradient-to-br from-epl-blue to-epl-purple flex items-center justify-center"
                          >
                            <span class="text-white text-sm font-bold">
                              {{ team?.team?.name?.charAt(0) || 'T' }}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div class="font-bold text-gray-900 text-sm">
                            {{ team?.team?.name || 'Team Name' }}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Points -->
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-epl-blue to-epl-purple text-white">
                      {{ team.points }} pts
                    </span>
                  </div>

                  <!-- Stats Grid -->
                  <div class="grid grid-cols-4 gap-2 mb-3">
                    <div class="text-center">
                      <div class="text-xs text-gray-500">P</div>
                      <div class="font-bold text-gray-900">{{ team.all.played }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500">W</div>
                      <div class="font-bold text-epl-green">{{ team.all.win }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500">D</div>
                      <div class="font-bold text-epl-gold">{{ team.all.draw }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500">L</div>
                      <div class="font-bold text-epl-red">{{ team.all.lose }}</div>
                    </div>
                  </div>

                  <!-- Goals and Form Row -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="text-center">
                        <div class="text-xs text-gray-500">GF</div>
                        <div class="font-bold text-epl-blue">{{ team.all.goals.for }}</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xs text-gray-500">GA</div>
                        <div class="font-bold text-epl-purple">{{ team.all.goals.against }}</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xs text-gray-500">GD</div>
                        <div 
                          :class="[
                            'font-bold px-2 py-1 rounded text-xs',
                            team.goalsDiff > 0 ? 'bg-green-100 text-epl-green' : team.goalsDiff < 0 ? 'bg-red-100 text-epl-red' : 'bg-gray-100 text-gray-900'
                          ]"
                        >
                          {{ team.goalsDiff > 0 ? '+' : '' }}{{ team.goalsDiff }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Form -->
                    <div class="flex items-center space-x-1">
                      <span
                        v-for="(result, formIndex) in (team.form ? team.form.slice(-5) : '')"
                        :key="formIndex"
                        :class="[
                          'w-3 h-3 rounded-full shadow-sm',
                          getFormResultClass(result)
                        ]"
                        :title="getFormResultTitle(result)"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="card-enhanced text-center py-8 md:py-16">
            <div class="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce-gentle">🏆</div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">No Standings Available</h3>
            <p class="text-sm md:text-lg text-gray-600">Standings data is not available for the selected season.</p>
          </div>
        </template>
      </div>
    </div>

    <!-- League Info -->
    <div v-if="leagueInfo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-12">
      <div class="card-enhanced">
        <div class="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-lg md:rounded-xl flex items-center justify-center">
            <span class="text-white text-sm md:text-lg">ℹ️</span>
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-gray-900">League Information</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div class="text-center p-4 md:p-6 bg-gradient-to-br from-epl-blue/5 to-epl-purple/5 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-3xl font-bold text-epl-blue mb-1 md:mb-2">{{ leagueInfo.name }}</div>
            <div class="text-xs md:text-sm text-gray-600 font-medium">League</div>
          </div>
          <div class="text-center p-4 md:p-6 bg-gradient-to-br from-epl-purple/5 to-epl-gold/5 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-3xl font-bold text-epl-purple mb-1 md:mb-2">{{ leagueInfo.country }}</div>
            <div class="text-xs md:text-sm text-gray-600 font-medium">Country</div>
          </div>
          <div class="text-center p-4 md:p-6 bg-gradient-to-br from-epl-gold/5 to-epl-red/5 rounded-lg md:rounded-xl">
            <div class="text-xl md:text-3xl font-bold text-epl-gold mb-1 md:mb-2">{{ selectedSeason }}/{{ selectedSeason + 1 }}</div>
            <div class="text-xs md:text-sm text-gray-600 font-medium">Season</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { standingsAPI } from '../services/api'
import { getTeamLogo } from '../utils/logos'

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
        
        if (data && Array.isArray(data) && data.length > 0) {
          // API returns array with league object
          const table = data[0]?.league?.standings?.[0] || []
          standings.value = table
          leagueInfo.value = data[0]?.league || null
        } else if (data && data.league) {
          // Fallback for direct league object
          const table = data.league?.standings?.[0] || []
          standings.value = table
          leagueInfo.value = data.league || null
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
      getFormResultTitle,
      getTeamLogo
    }
  }
}
</script>
