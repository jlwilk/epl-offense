<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-gradient-to-br from-epl-blue/5 via-epl-purple/5 to-epl-gold/5 py-12">
      <div class="absolute inset-0 bg-pattern opacity-30"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white text-xl">🏆</span>
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-gradient">Premier League</h1>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-700">Teams</h2>
            </div>
          </div>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Explore all Premier League teams and their performance statistics for the {{ filters.season }}/{{ parseInt(filters.season) + 1 }} season</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters -->
      <div class="card-enhanced mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center">
            <span class="text-white text-lg">🔍</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Filters & Sorting</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">Season</label>
            <select
              v-model="filters.season"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchTeams"
            >
              <option value="2025">2025/26</option>
              <option value="2024">2024/25</option>
              <option value="2023">2023/24</option>
            </select>
          </div>
          
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">Sort By</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
            >
              <option value="rank">League Position</option>
              <option value="name">Team Name (A-Z)</option>
              <option value="name-desc">Team Name (Z-A)</option>
              <option value="points">Points (High to Low)</option>
              <option value="points-asc">Points (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-epl-blue mx-auto mb-6"></div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Loading Teams</h3>
        <p class="text-gray-600">Fetching Premier League team data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card-enhanced text-center py-16">
        <div class="text-8xl mb-6">⚠️</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Error Loading Teams</h3>
        <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
        <button @click="fetchTeams" class="btn-primary text-lg px-8 py-3">
          Try Again
        </button>
      </div>

      <!-- Teams Grid -->
      <div v-else-if="sortedTeams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="team in sortedTeams"
          :key="team.team?.id || team.id"
          class="team-card group"
          @click="viewTeam(team.team?.id || team.id)"
        >
          <div class="text-center space-y-6">
            <!-- Team Logo -->
            <div class="team-logo-container">
              <img 
                v-if="getTeamLogo(team?.team?.name || team?.name)" 
                :src="getTeamLogo(team?.team?.name || team?.name)" 
                :alt="team?.team?.name || team?.name || 'Team'"
                class="team-logo"
                @error="$event.target.style.display='none'"
              />
              <div 
                v-else
                class="team-logo-fallback"
              >
                <span class="text-white text-3xl font-bold">
                  {{ (team?.team?.name || team?.name || 'T')?.charAt(0) }}
                </span>
              </div>
            </div>
            
            <!-- Team Name -->
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-epl-blue transition-colors duration-200">
              {{ team?.team?.name || team?.name || 'Team Name' }}
            </h3>
            
            <!-- Team Stats -->
            <div class="team-stats">
              <div class="stat-row">
                <span class="stat-label">Position:</span>
                <span class="stat-value points-badge">{{ getTeamPosition(team) }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Points:</span>
                <span class="stat-value points-badge">{{ getTeamPoints(team) }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Country:</span>
                <span class="stat-value">{{ team.team?.country || team?.country || 'England' }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Founded:</span>
                <span class="stat-value">{{ team.team?.founded || team?.founded || 'N/A' }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Venue:</span>
                <span class="stat-value">{{ team.venue?.name || team?.venue_name || 'N/A' }}</span>
              </div>
            </div>
            
            <!-- View Details Button -->
            <div class="pt-4">
              <span class="inline-block bg-gradient-to-r from-epl-blue to-epl-purple text-white font-bold py-2 px-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card-enhanced text-center py-16">
        <div class="text-8xl mb-6 animate-bounce-gentle">🏆</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">No Teams Found</h3>
        <p class="text-gray-600 text-lg">No team data available for the selected season.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { teamsAPI, standingsAPI } from '../services/api'
import { getTeamLogo } from '../utils/logos'

export default {
  name: 'Teams',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const teams = ref([])
    const standings = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const itemsPerPage = 20
    
    const filters = ref({
      season: 2025,
      sortBy: 'rank'
    })

    // Computed properties
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    const sortedTeams = computed(() => {
      if (!teams.value.length) return []
      
      const teamsCopy = [...teams.value]
      
      switch (filters.value.sortBy) {
        case 'rank':
          return teamsCopy.sort((a, b) => getTeamRank(a) - getTeamRank(b))
        case 'name':
          return teamsCopy.sort((a, b) => {
            const nameA = (a?.team?.name || a?.name || '').toLowerCase()
            const nameB = (b?.team?.name || b?.name || '').toLowerCase()
            return nameA.localeCompare(nameB)
          })
        case 'name-desc':
          return teamsCopy.sort((a, b) => {
            const nameA = (a?.team?.name || a?.name || '').toLowerCase()
            const nameB = (b?.team?.name || b?.name || '').toLowerCase()
            return nameB.localeCompare(nameA)
          })
        case 'points':
          return teamsCopy.sort((a, b) => {
            const pointsA = getTeamPoints(a) === 'N/A' ? 0 : getTeamPoints(a)
            const pointsB = getTeamPoints(b) === 'N/A' ? 0 : getTeamPoints(b)
            return pointsB - pointsA // High to low
          })
        case 'points-asc':
          return teamsCopy.sort((a, b) => {
            const pointsA = getTeamPoints(a) === 'N/A' ? 0 : getTeamPoints(a)
            const pointsB = getTeamPoints(b) === 'N/A' ? 0 : getTeamPoints(b)
            return pointsA - pointsB // Low to high
          })
        default:
          return teamsCopy
      }
    })

    // API functions
    const fetchStandings = async () => {
      try {
        const data = await standingsAPI.getStandings({ 
          season: filters.value.season,
          league: 39 // Premier League
        })
        
        if (data && data[0] && data[0].league && data[0].league.standings) {
          standings.value = data[0].league.standings[0] || []
        } else {
          standings.value = []
        }
      } catch (err) {
        console.error('Error fetching standings:', err)
        standings.value = []
      }
    }

    const fetchTeams = async () => {
      loading.value = true
      error.value = null
      
      try {
        await Promise.all([
          fetchStandings(),
          (async () => {
            const params = {
              ...filters.value,
              page: currentPage.value
            }
            
            const data = await teamsAPI.getTeams(params)
            
            if (data && data.response) {
              teams.value = data.response
              totalPages.value = Math.ceil((data.paging?.total || teams.value.length) / itemsPerPage)
            } else {
              teams.value = Array.isArray(data) ? data : []
              totalPages.value = 1
            }
          })()
        ])
      } catch (err) {
        console.error('Error fetching teams:', err)
        error.value = 'Failed to load teams. Please try again.'
        teams.value = []
      } finally {
        loading.value = false
      }
    }

    // Helper functions - Standings
    const getTeamPosition = (team) => {
      if (!standings.value.length) return 'N/A'
      
      const teamId = team?.team?.id || team?.id
      const standing = standings.value.find(s => s.team?.id === teamId)
      return standing ? standing.rank : 'N/A'
    }

    const getTeamPoints = (team) => {
      if (!standings.value.length) return 'N/A'
      
      const teamId = team?.team?.id || team?.id
      const standing = standings.value.find(s => s.team?.id === teamId)
      return standing ? standing.points : 'N/A'
    }

    const getTeamRank = (team) => {
      if (!standings.value.length) return 999 // High number for teams not in standings
      
      const teamId = team?.team?.id || team?.id
      const standing = standings.value.find(s => s.team?.id === teamId)
      return standing ? standing.rank : 999
    }

    // Navigation functions
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchTeams()
      }
    }

    const viewTeam = (teamId) => {
      router.push(`/teams/${teamId}`)
    }

    // Lifecycle
    onMounted(() => {
      fetchTeams()
    })

    return {
      // Reactive data
      teams,
      standings,
      sortedTeams,
      loading,
      error,
      filters,
      currentPage,
      totalPages,
      
      // Computed properties
      visiblePages,
      
      // Functions
      fetchTeams,
      changePage,
      viewTeam,
      
      // Helper functions
      getTeamPosition,
      getTeamPoints,
      getTeamRank,
      getTeamLogo
    }
  }
}
</script>
