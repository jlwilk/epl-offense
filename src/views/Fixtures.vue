<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Premier League Fixtures</h1>
        <p class="text-gray-600 mt-2">Match schedules, results, and live updates</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            v-model="filters.season"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="fetchFixtures"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">League</label>
          <select
            v-model="filters.league"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="fetchFixtures"
          >
            <option value="39">Premier League</option>
            <option value="140">La Liga</option>
            <option value="135">Serie A</option>
            <option value="78">Bundesliga</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
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
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="fetchFixtures"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="fetchFixtures"
          />
        </div>
        
        <div class="flex items-end">
          <button
            @click="fetchFixtures"
            class="w-full btn-primary"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </span>
            <span v-else>Search</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-4">
      <button
        @click="showLiveFixtures"
        class="btn-primary"
        :class="{ 'bg-epl-red': showingLive }"
      >
        <span v-if="showingLive" class="animate-pulse">🔴</span>
        Live Fixtures
      </button>
      <button
        @click="showTodayFixtures"
        class="btn-secondary"
      >
        Today's Fixtures
      </button>
      <button
        @click="showUpcomingFixtures"
        class="btn-secondary"
      >
        Upcoming
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading fixtures...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Fixtures</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchFixtures" class="btn-primary">Try Again</button>
    </div>

    <!-- Fixtures List -->
    <div v-else-if="fixtures.length > 0" class="space-y-4">
      <div
        v-for="fixture in fixtures"
        :key="fixture.fixture.id"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="viewFixture(fixture.fixture.id)"
      >
        <div class="flex items-center justify-between">
          <!-- League Info -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-epl-blue to-epl-purple rounded-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">
                {{ fixture.league?.name?.charAt(0) || 'L' }}
              </span>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ fixture.league?.name }}</div>
              <div class="text-xs text-gray-500">{{ fixture.league?.round }}</div>
            </div>
          </div>
          
          <!-- Match Status -->
          <div class="text-center">
            <div 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(fixture.fixture.status.short)
              ]"
            >
              {{ getStatusText(fixture.fixture.status.short) }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatDate(fixture.fixture.date) }}
            </div>
          </div>
          
          <!-- Teams and Score -->
          <div class="flex-1 mx-8">
            <div class="flex items-center justify-between">
              <!-- Home Team -->
              <div class="flex items-center space-x-3 flex-1">
                <div class="w-10 h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">
                    {{ fixture?.teams?.home?.name?.charAt(0) || 'H' }}
                  </span>
                </div>
                <span class="font-medium text-gray-900">{{ fixture?.teams?.home?.name || 'Home Team' }}</span>
              </div>
              
              <!-- Score -->
              <div class="text-center mx-4">
                <div v-if="fixture.fixture.status.short === 'NS'" class="text-lg font-bold text-gray-400">
                  vs
                </div>
                <div v-else class="text-2xl font-bold text-gray-900">
                  {{ fixture.goals.home || 0 }} - {{ fixture.goals.away || 0 }}
                </div>
                <div v-if="fixture.fixture.status.short === 'LIVE'" class="text-xs text-red-600 font-medium animate-pulse">
                  {{ fixture.fixture.status.elapsed }}'
                </div>
              </div>
              
              <!-- Away Team -->
              <div class="flex items-center space-x-3 flex-1 justify-end">
                <span class="font-medium text-gray-900">{{ fixture?.teams?.away?.name || 'Away Team' }}</span>
                <div class="w-10 h-10 bg-gradient-to-br from-epl-gold to-epl-red rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">
                    {{ fixture?.teams?.away?.name?.charAt(0) || 'A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Venue -->
          <div class="text-right">
            <div class="text-sm text-gray-600">{{ fixture.fixture.venue?.name || 'TBD' }}</div>
            <div class="text-xs text-gray-500">{{ fixture.fixture.venue?.city || '' }}</div>
          </div>
        </div>
        
        <!-- Additional Info -->
        <div v-if="fixture.fixture.status.short !== 'NS'" class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-4">
              <span>Referee: {{ fixture.fixture.referee || 'TBD' }}</span>
              <span>Attendance: {{ fixture.fixture.attendance || 'TBD' }}</span>
            </div>
            <button class="text-epl-blue hover:text-epl-purple font-medium">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card text-center py-12">
      <div class="text-6xl mb-4">⚽</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Fixtures Found</h3>
      <p class="text-gray-600">Try adjusting your search criteria or filters.</p>
    </div>

    <!-- Pagination -->
    <div v-if="fixtures.length > 0 && totalPages > 1" class="flex justify-center">
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
    
    const filters = ref({
      season: 2025,
      league: 39,
      status: '',
      fromDate: '',
      toDate: ''
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
      showingLive.value = !showingLive.value
      if (showingLive.value) {
        filters.value.status = 'LIVE'
        await fetchFixtures()
      } else {
        filters.value.status = ''
        await fetchFixtures()
      }
    }

    const showTodayFixtures = async () => {
      const today = new Date().toISOString().split('T')[0]
      filters.value.fromDate = today
      filters.value.toDate = today
      await fetchFixtures()
    }

    const showUpcomingFixtures = async () => {
      const today = new Date().toISOString().split('T')[0]
      filters.value.fromDate = today
      filters.value.toDate = ''
      filters.value.status = 'NS'
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
      fetchFixtures,
      showLiveFixtures,
      showTodayFixtures,
      showUpcomingFixtures,
      changePage,
      viewFixture,
      getStatusClass,
      getStatusText,
      formatDate
    }
  }
}
</script>
