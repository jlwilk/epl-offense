<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-gradient-to-br from-epl-blue/5 via-epl-purple/5 to-epl-gold/5 py-12">
      <div class="absolute inset-0 bg-pattern opacity-30"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white text-xl">📅</span>
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-gradient">Premier League</h1>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-700">Fixtures</h2>
            </div>
          </div>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">Match schedules, results, and live updates for the {{ filters.season }}/{{ parseInt(filters.season) + 1 }} season</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search and Filters -->
      <div class="card-enhanced mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center">
            <span class="text-white text-lg">🔍</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Search & Filters</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">Season</label>
            <select
              v-model="filters.season"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchFixtures"
            >
              <option value="2025">2025/26</option>
              <option value="2024">2024/25</option>
              <option value="2023">2023/24</option>
            </select>
          </div>
          
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">League</label>
            <select
              v-model="filters.league"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchFixtures"
            >
              <option value="39">Premier League</option>
              <option value="140">La Liga</option>
              <option value="135">Serie A</option>
              <option value="78">Bundesliga</option>
            </select>
          </div>
          
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchFixtures"
            >
              <option value="">All Status</option>
              <option value="NS">Not Started</option>
              <option value="1H">First Half</option>
              <option value="HT">Half Time</option>
              <option value="2H">Second Half</option>
              <option value="FT">Full Time</option>
              <option value="LIVE">Live</option>
            </select>
          </div>
          
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">From Date</label>
            <input
              v-model="filters.from_date"
              type="date"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchFixtures"
            />
          </div>
          
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-3">To Date</label>
            <input
              v-model="filters.to_date"
              type="date"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-epl-blue focus:border-transparent bg-white shadow-lg font-medium text-lg"
              @change="fetchFixtures"
            />
          </div>
          
          <div class="flex items-end">
            <button
              @click="fetchFixtures"
              class="w-full btn-primary text-lg py-3"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading...
              </span>
              <span v-else>Search Fixtures</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button
          @click="showLiveFixtures"
          class="quick-action-btn"
          :class="{ 'quick-action-btn-active': showingLive }"
        >
          <span class="text-xl mr-2">⚽</span>
          Live Matches
        </button>
        <button
          @click="showTodayFixtures"
          class="quick-action-btn"
          :class="{ 'quick-action-btn-active': showingToday }"
        >
          <span class="text-xl mr-2">📅</span>
          Today's Matches
        </button>
        <button
          @click="showUpcomingFixtures"
          class="quick-action-btn"
          :class="{ 'quick-action-btn-active': showingUpcoming }"
        >
          <span class="text-xl mr-2">⏰</span>
          Upcoming
        </button>
        <button
          @click="showFinishedFixtures"
          class="quick-action-btn"
          :class="{ 'quick-action-btn-active': showingFinished }"
        >
          <span class="text-xl mr-2">🏁</span>
          Finished
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-epl-blue mx-auto mb-6"></div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Loading Fixtures</h3>
        <p class="text-gray-600">Fetching match data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card-enhanced text-center py-16">
        <div class="text-8xl mb-6">⚠️</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Error Loading Fixtures</h3>
        <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
        <button @click="fetchFixtures" class="btn-primary text-lg px-8 py-3">
          Try Again
        </button>
      </div>

      <!-- Fixtures List -->
      <div v-else-if="fixtures.length > 0" class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Match Results</h3>
          <div class="text-gray-600">Showing {{ fixtures.length }} matches</div>
        </div>
        
        <div 
          v-for="fixture in fixtures" 
          :key="`${fixture.fixture?.id || fixture.id}-${fixture.fixture?.status?.elapsed || fixture.elapsed || 0}-${fixture.fixture?.status?.extra || 0}`"
                      :class="[
              'fixture-card',
              isLiveFixture(fixture) 
                ? 'fixture-card-live' 
                : 'fixture-card-upcoming'
            ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div :class="isLiveFixture(fixture) ? 'text-sm text-white/80' : 'text-sm text-gray-600'">
                {{ fixture.league?.name }}
              </div>
              <div 
                v-if="isLiveFixture(fixture)"
                class="live-badge"
              >
                LIVE
              </div>
              <div 
                v-else
                class="status-badge"
              >
                {{ getFixtureStatus(fixture) }}
              </div>
            </div>
            <div :class="isLiveFixture(fixture) ? 'text-sm text-white/80' : 'text-sm text-gray-600'">
              {{ getFixtureTime(fixture) }}
            </div>
          </div>
        
          <div class="flex items-center justify-center space-x-8">
            <!-- Home Team -->
            <div class="team-section">
              <div class="team-logo">
                <img 
                  v-if="fixture.teams?.home?.logo" 
                  :src="fixture.teams.home.logo" 
                  :alt="fixture.teams.home.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
              </div>
                              <span :class="isLiveFixture(fixture) ? 'team-name-live' : 'team-name'">
                  {{ fixture.teams?.home?.name }}
                </span>
            </div>
            
            <!-- Score -->
            <div class="score-section">
              <div :class="isLiveFixture(fixture) ? 'score-live' : 'score'">
                {{ fixture.goals?.home || 0 }} - {{ fixture.goals?.away || 0 }}
              </div>
              <div :class="isLiveFixture(fixture) ? 'text-xs text-white/70' : 'text-xs text-gray-500'">
                {{ getFixtureTimeDisplay(fixture) }}
              </div>
            </div>
            
            <!-- Away Team -->
            <div class="team-section">
                              <span :class="isLiveFixture(fixture) ? 'team-name-live' : 'team-name'">
                  {{ fixture.teams?.away?.name }}
                </span>
              <div class="team-logo">
                <img 
                  v-if="fixture.teams?.away?.logo" 
                  :src="fixture.teams.away.logo" 
                  :alt="fixture.teams.away.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card-enhanced text-center py-16">
        <div class="text-8xl mb-6 animate-bounce-gentle">⚽</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">No Fixtures Found</h3>
        <p class="text-gray-600 text-lg">No matches found for the selected criteria.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fixturesAPI } from '../services/api'

export default {
  name: 'Fixtures',
  setup() {
    const router = useRouter()
    const fixtures = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const showingLive = ref(false)
    const showingToday = ref(false)
    const showingUpcoming = ref(false)
    const showingFinished = ref(false)
    
    const filters = ref({
      season: 2025,
      league: 39,
      status: '',
      from_date: '',
      to_date: ''
    })

    const fetchFixtures = async () => {
      loading.value = true
      error.value = null
      
      try {
        const params = {
          ...filters.value,
          page: currentPage.value
        }
        
        const data = await fixturesAPI.getFixtures(params)
        
        if (data && data.response) {
          fixtures.value = data.response
          totalPages.value = Math.ceil((data.paging?.total || fixtures.value.length) / 20)
        } else {
          fixtures.value = Array.isArray(data) ? data : []
          totalPages.value = 1
        }
      } catch (err) {
        console.error('Error fetching fixtures:', err)
        error.value = 'Failed to load fixtures. Please try again.'
        fixtures.value = []
      } finally {
        loading.value = false
      }
    }

    const showLiveFixtures = async () => {
      // Reset all states
      showingLive.value = true
      showingToday.value = false
      showingUpcoming.value = false
      showingFinished.value = false
      
      filters.value.status = 'LIVE'
      await fetchFixtures()
    }

    const showTodayFixtures = async () => {
      // Reset all states
      showingLive.value = false
      showingToday.value = true
      showingUpcoming.value = false
      showingFinished.value = false
      
      const today = new Date().toISOString().split('T')[0]
      filters.value.from_date = today
      filters.value.to_date = today
      filters.value.status = ''
      await fetchFixtures()
    }

    const showUpcomingFixtures = async () => {
      // Reset all states
      showingLive.value = false
      showingToday.value = false
      showingUpcoming.value = true
      showingFinished.value = false
      
      const today = new Date().toISOString().split('T')[0]
      // Set end date to 14 days from today for upcoming matches
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 14)
      const endDateStr = endDate.toISOString().split('T')[0]
      
      filters.value.from_date = today
      filters.value.to_date = endDateStr
      filters.value.status = 'NS'
      await fetchFixtures()
    }

    const showFinishedFixtures = async () => {
      // Reset all states
      showingLive.value = false
      showingToday.value = false
      showingUpcoming.value = false
      showingFinished.value = true
      
      filters.value.status = 'FT'
      filters.value.from_date = ''
      filters.value.to_date = ''
      await fetchFixtures()
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchFixtures()
      }
    }

    const viewFixture = (fixtureId) => {
      router.push(`/fixtures/${fixtureId}`)
    }

    // Helper functions
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
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Helper functions for fixture display
    const isLiveFixture = (fixture) => {
      const status = fixture.fixture?.status?.short || fixture.status?.short || fixture.status
      return status === 'LIVE' || status === 'HT' || status === '1H' || status === '2H'
    }

    const getFixtureStatus = (fixture) => {
      const status = fixture.fixture?.status?.short || fixture.status?.short || fixture.status
      switch (status) {
        case 'NS': return 'UPCOMING'
        case 'FT': return 'FINISHED'
        case 'HT': return 'HALF TIME'
        case '1H': return '1ST HALF'
        case '2H': return '2ND HALF'
        default: return status || 'UNKNOWN'
      }
    }

    const getFixtureTime = (fixture) => {
      if (isLiveFixture(fixture)) {
        return `${fixture.fixture?.status?.elapsed || fixture.elapsed || 0}'`
      } else {
        const date = fixture.fixture?.date || fixture.date
        if (date) {
          return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        }
        return 'TBD'
      }
    }

    const getFixtureTimeDisplay = (fixture) => {
      if (isLiveFixture(fixture)) {
        const elapsed = fixture.fixture?.status?.elapsed || fixture.elapsed || 0
        const extra = fixture.fixture?.status?.extra || 0
        let timeDisplay = elapsed.toString()
        if (extra && extra > 0) {
          timeDisplay += `+${extra}`
        }
        return timeDisplay + "'"
      } else {
        const date = fixture.fixture?.date || fixture.date
        if (date) {
          return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        }
        return 'TBD'
      }
    }

    // Computed properties for pagination
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    onMounted(() => {
      fetchFixtures()
    })

    return {
      fixtures,
      loading,
      error,
      filters,
      currentPage,
      totalPages,
      visiblePages,
      showingLive,
      showingToday,
      showingUpcoming,
      showingFinished,
      fetchFixtures,
      showLiveFixtures,
      showTodayFixtures,
      showUpcomingFixtures,
      showFinishedFixtures,
      changePage,
      viewFixture,
      getStatusClass,
      getStatusText,
      formatDate,
      isLiveFixture,
      getFixtureStatus,
      getFixtureTime,
      getFixtureTimeDisplay
    }
  }
}
</script>
