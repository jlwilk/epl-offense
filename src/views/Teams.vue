<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Premier League Teams</h1>
        <p class="text-gray-600 mt-2">Explore all teams and their performance statistics</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            v-model="filters.season"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="fetchTeams"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="filters.sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
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
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading teams...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Teams</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchTeams" class="btn-primary">Try Again</button>
    </div>

    <!-- Teams Grid -->
    <div v-else-if="sortedTeams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="team in sortedTeams"
        :key="team.team?.id || team.id"
        class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        @click="viewTeam(team.team?.id || team.id)"
      >
        <div class="text-center space-y-4">
          <!-- Team Logo -->
          <div class="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img 
              v-if="team?.team?.logo || team?.logo" 
              :src="team?.team?.logo || team?.logo" 
              :alt="team?.team?.name || team?.name || 'Team'"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-epl-blue to-epl-purple flex items-center justify-center"
            >
              <span class="text-white text-2xl font-bold">
                {{ (team?.team?.name || team?.name || 'T')?.charAt(0) }}
              </span>
            </div>
          </div>
          
          <!-- Team Name -->
          <h3 class="text-lg font-semibold text-gray-900">{{ team?.team?.name || team?.name || 'Team Name' }}</h3>
          
          <!-- Team Info -->
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Country:</span>
              <span class="font-medium">{{ team.team?.country || team?.country || 'England' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Founded:</span>
              <span class="font-medium">{{ team.team?.founded || team?.founded || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Venue:</span>
              <span class="font-medium">{{ team.venue?.name || team?.venue_name || 'N/A' }}</span>
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div class="text-center">
              <div class="text-lg font-bold text-epl-blue">{{ getTeamPosition(team) }}</div>
              <div class="text-xs text-gray-500">Position</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-epl-gold">{{ getTeamPoints(team) }}</div>
              <div class="text-xs text-gray-500">Points</div>
            </div>
          </div>
          
          <!-- View Details Button -->
          <button class="btn-primary w-full mt-4">
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <div class="text-6xl mb-4">🏟️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Teams Found</h3>
      <p class="text-gray-600">Try adjusting your search criteria or filters.</p>
    </div>

    <!-- Pagination -->
    <div v-if="sortedTeams.length > 0 && totalPages > 1" class="flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg',
              page === currentPage
                ? 'bg-epl-blue text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { teamsAPI, standingsAPI } from '../services/api'

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
      getTeamRank
    }
  }
}
</script>
