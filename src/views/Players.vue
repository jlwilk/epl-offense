<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Premier League Players</h1>
        <p class="text-gray-600 mt-2">Discover top performers and player statistics</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Players</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by first or last name..."
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
              @input="debouncedSearch"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            v-model="filters.season"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="resetAndFetch"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <select
            v-model="filters.position"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="resetAndFetch"
          >
            <option value="">All Positions</option>
            <option value="Attacker">Attacker</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
            <option value="Goalkeeper">Goalkeeper</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="filters.sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="handleSortByChange"
          >
            <option value="lastname">Last Name</option>
            <option value="firstname">First Name</option>
            <option value="name">Full Name</option>
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="rating">Rating</option>
            <option value="age">Age</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <select
            v-model="filters.sortOrder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-epl-blue focus:border-transparent"
            @change="resetAndFetch"
          >
            <option value="asc">A-Z / Low to High</option>
            <option value="desc">Z-A / High to Low</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="fetchPlayers"
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



    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epl-blue mx-auto mb-4"></div>
      <p class="text-gray-600">Loading players...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Players</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchPlayers" class="btn-primary">Try Again</button>
    </div>

    <!-- Players Grid -->
    <div v-else-if="players.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="player in players"
        :key="player.player?.id || player.id"
        class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        @click="viewPlayer(player.player?.id || player.id)"
      >
        <div class="text-center space-y-4">
          <!-- Player Avatar -->
          <div class="w-24 h-24 rounded-full overflow-hidden mx-auto">
            <img 
              v-if="player?.player?.photo || player?.photo" 
              :src="player?.player?.photo || player?.photo" 
              :alt="`${player?.player?.firstname || player?.firstname || 'First'} ${player?.player?.lastname || player?.lastname || 'Last'}`"
              class="w-full h-full object-cover"
              @error="$event.target.style.display='none'"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-epl-gold to-epl-red flex items-center justify-center"
            >
              <span class="text-white text-3xl font-bold">
                {{ (player?.player?.firstname || player?.firstname)?.charAt(0) || 'P' }}
              </span>
            </div>
          </div>
          
          <!-- Player Name -->
          <h3 class="text-lg font-semibold text-gray-900">
            {{ player?.player?.firstname || player?.firstname || 'First' }} {{ player?.player?.lastname || player?.lastname || 'Last' }}
          </h3>
          
          <!-- Player Info -->
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Age:</span>
              <span class="font-medium">{{ player?.player?.age || player?.age || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Nationality:</span>
              <span class="font-medium">{{ player?.player?.nationality || player?.nationality || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Team:</span>
              <span class="font-medium">{{ player.statistics?.[0]?.team?.name || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Position:</span>
              <span class="font-medium">{{ player.statistics?.[0]?.games?.position || 'N/A' }}</span>
            </div>
          </div>
          
          <!-- Key Stats -->
          <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div class="text-center">
              <div class="text-lg font-bold text-epl-red">{{ player.statistics[0]?.goals?.total || 0 }}</div>
              <div class="text-xs text-gray-500">Goals</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-epl-blue">{{ player.statistics[0]?.goals?.assists || 0 }}</div>
              <div class="text-xs text-gray-500">Assists</div>
            </div>
                          <div class="text-center">
                <div class="text-lg font-bold" :class="getRatingColor(player.statistics[0]?.games?.rating || 0)">
                  {{ player.statistics[0]?.games?.rating || 0 }}
                </div>
                <div class="text-xs text-gray-500">Rating</div>
              </div>
          </div>
          
          <!-- Additional Stats -->
          <div class="grid grid-cols-4 gap-2 pt-2 text-xs text-gray-500">
            <div class="text-center">
              <div class="font-medium">{{ player.statistics[0]?.games?.appearences || 0 }}</div>
              <div>Apps</div>
            </div>
            <div class="text-center">
              <div class="font-medium">{{ player.statistics[0]?.games?.minutes || 0 }}</div>
              <div>Mins</div>
            </div>
            <div class="text-center">
              <div class="font-medium text-yellow-600">{{ player.statistics[0]?.cards?.yellow || 0 }}</div>
              <div>YC</div>
            </div>
            <div class="text-center">
              <div class="font-medium text-red-600">{{ player.statistics[0]?.cards?.red || 0 }}</div>
              <div>RC</div>
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
      <div class="text-6xl mb-4">⚽</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Players Found</h3>
      <p class="text-gray-600">Try adjusting your search criteria or filters.</p>
    </div>

    <!-- Load More Button -->
    <div v-if="players.length > 0 && hasMore" class="text-center py-6">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="btn-primary px-8 py-3"
      >
        <span v-if="loadingMore" class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading More...
        </span>
        <span v-else>Load More Players</span>
      </button>
      
      <!-- Debug Info -->
      <div class="mt-4 text-sm text-gray-500">
        <p>Current page: {{ currentPage }}, Players loaded: {{ players.length }}, Has more: {{ hasMore }}</p>
        <p>Scroll to the bottom to auto-load more players</p>
      </div>
    </div>

    <!-- Loading More Indicator -->
    <div v-if="loadingMore" class="text-center py-6">
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-epl-blue"></div>
        <span class="text-gray-600">Loading more players...</span>
      </div>
    </div>

    <!-- End of Results -->
    <div v-if="players.length > 0 && !hasMore" class="text-center py-6 text-gray-500">
      <p>🎯 You've reached the end of all available players!</p>
    </div>

    <!-- Intersection Observer Target for Auto-loading -->
    <div ref="observerTarget" class="h-8 bg-transparent"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { playerStatsAPI } from '../services/api'

export default {
  name: 'Players',
  setup() {
    const router = useRouter()
    const players = ref([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const totalPages = ref(1)
    const itemsPerPage = 50
    const hasMore = ref(true)
    
    const filters = ref({
      season: 2025,
      league: 39,
      position: '',
      sortBy: 'rating',
      sortOrder: 'desc'
    })



    // Debounced search function
    let searchTimeout
    const debouncedSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        currentPage.value = 1
        fetchPlayers()
      }, 300) // Reduced from 500ms to 300ms for faster response
    }

    // Reset page when filters change
    const resetAndFetch = () => {
      currentPage.value = 1
      players.value = []
      hasMore.value = true
      fetchPlayers()
    }

    // Clear search and reset
    const clearSearch = () => {
      searchQuery.value = ''
      currentPage.value = 1
      players.value = []
      hasMore.value = true
      fetchPlayers()
    }

    // Get rating color based on rating value
    const getRatingColor = (rating) => {
      if (!rating || rating === 0) return 'text-gray-400' // No rating
      if (rating >= 8.5) return 'text-green-600' // Exceptional (8.5+)
      if (rating >= 7.5) return 'text-blue-600' // Very Good (7.5-8.4)
      if (rating >= 6.5) return 'text-epl-gold' // Good (6.5-7.4)
      if (rating >= 5.5) return 'text-orange-500' // Average (5.5-6.4)
      return 'text-red-500' // Below Average (<5.5)
    }

    // Handle sort by change with automatic order adjustment
    const handleSortByChange = () => {
      // Auto-set sort order for rating and stats (descending is better)
      if (['rating', 'goals', 'assists'].includes(filters.value.sortBy)) {
        filters.value.sortOrder = 'desc'
      }
      // Auto-set sort order for names and age (ascending is better)
      else if (['lastname', 'firstname', 'name', 'age'].includes(filters.value.sortBy)) {
        filters.value.sortOrder = 'asc'
      }
      
      resetAndFetch()
    }

    // Load more players for infinite scroll
    const loadMore = async () => {
      if (loadingMore.value || !hasMore.value || searchQuery.value.trim()) return
      
      // Check if we've already loaded this page
      const nextPage = currentPage.value + 1
      console.log('Loading more players, next page:', nextPage)
      
      currentPage.value = nextPage
      await fetchPlayers(true)
      
      // Ensure observer is set up for next load
      if (hasMore.value) {
        nextTick(() => {
          setupIntersectionObserver()
        })
      }
    }

    // Intersection Observer for automatic infinite scroll
    const observerTarget = ref(null)
    let observer = null
    
    const setupIntersectionObserver = () => {
      if (!observerTarget.value) {
        console.log('Observer target not found, retrying...')
        return
      }
      
      // Clean up existing observer
      if (observer) {
        observer.disconnect()
        observer = null
      }
      
      observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          console.log('Intersection observer triggered:', {
            isIntersecting: target.isIntersecting,
            hasMore: hasMore.value,
            loadingMore: loadingMore.value,
            currentPlayers: players.value.length,
            currentPage: currentPage.value
          })
          
          if (target.isIntersecting && hasMore.value && !loadingMore.value) {
            console.log('Auto-loading more players...')
            loadMore()
          }
        },
        {
          rootMargin: '300px', // Start loading when 300px from bottom
          threshold: 0.1
        }
      )
      
      observer.observe(observerTarget.value)
      console.log('Intersection observer set up successfully for page', currentPage.value)
      
      // Cleanup function
      return () => {
        if (observer) {
          observer.disconnect()
          observer = null
        }
      }
    }

    const fetchPlayers = async (isLoadMore = false) => {
      if (isLoadMore) {
        loadingMore.value = true
      } else {
        loading.value = true
        error.value = null
        currentPage.value = 1
        players.value = []
        hasMore.value = true
      }
      
      try {
        let data
        
        if (searchQuery.value.trim()) {
          // Search players by name using the search endpoint
          console.log('🔍 Search request:', {
            query: searchQuery.value,
            endpoint: '/player-stats/search'
          })
          data = await playerStatsAPI.searchPlayers(searchQuery.value)
        } else {
          // Get league player statistics with new API parameters
          const params = {
            season: filters.value.season,
            page: currentPage.value,
            sort_by: filters.value.sortBy,
            sort_order: filters.value.sortOrder
          }
          
          // Add position filter if selected
          if (filters.value.position) {
            params.position = filters.value.position
          }
          
          data = await playerStatsAPI.getLeaguePlayerStats(filters.value.league, params)
        }
        
        console.log('Players API response:', {
          data,
          currentPage: currentPage.value,
          itemsPerPage,
          searchQuery: searchQuery.value.trim(),
          dataStructure: {
            hasData: !!data,
            hasResponse: !!data?.response,
            responseLength: data?.response?.length,
            dataType: typeof data,
            isArray: Array.isArray(data),
            firstItem: data?.response?.[0] || data?.[0]
          },
          pagination: data?.paging
        })
        
        let newPlayers = []
        if (data && data.response) {
          // Handle response structure
          newPlayers = Array.isArray(data.response) ? data.response : []
        } else if (Array.isArray(data)) {
          // Handle direct array
          newPlayers = data
        } else if (data && data.player) {
          // Handle single player object (unwrapped by interceptor)
          newPlayers = [data]
        }
        
        if (searchQuery.value.trim()) {
          // Search results - no pagination, replace all players
          players.value = newPlayers
          hasMore.value = false // No pagination for search results
        } else if (isLoadMore) {
          // Append new players for infinite scroll (only for non-search)
          players.value = [...players.value, ...newPlayers]
        } else {
          // Replace players for new filter
          players.value = newPlayers
        }
        
        // Check if there are more pages based on API pagination (only for non-search)
        if (!searchQuery.value.trim()) {
          const totalItems = data?.paging?.total || 0
          const currentTotal = players.value.length
          
          if (totalItems > 0) {
            hasMore.value = currentTotal < totalItems
          } else {
            // Fallback: if we got some players, there might be more
            hasMore.value = newPlayers.length > 0
          }
        }
        

        
        console.log('Players updated:', {
          currentPage: currentPage.value,
          newPlayersReceived: newPlayers.length,
          totalPlayersNow: players.value.length,
          hasMore: hasMore.value,
          totalItemsFromAPI: data?.paging?.total || 0
        })
        
        // Re-setup intersection observer after successful load
        if (isLoadMore && hasMore.value) {
          nextTick(() => {
            setupIntersectionObserver()
          })
        }
      } catch (err) {
        console.error('Error fetching players:', err)
        if (!isLoadMore) {
          error.value = 'Failed to load players. Please try again.'
          players.value = []
        }
      } finally {
        if (isLoadMore) {
          loadingMore.value = false
        } else {
          loading.value = false
        }
      }
    }



    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchPlayers()
      }
    }

    const viewPlayer = (playerId) => {
      router.push(`/players/${playerId}`)
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

    onMounted(async () => {
      await fetchPlayers()
      
      // Set up intersection observer after initial data load
      nextTick(() => {
        setupIntersectionObserver()
      })
    })

    // Watch for changes in players array to re-setup observer
    watch(players, () => {
      nextTick(() => {
        if (hasMore.value && players.value.length > 0) {
          console.log('Players array changed, re-setting up observer...')
          setupIntersectionObserver()
        }
      })
    }, { deep: true })

    return {
      players,
      loading,
      loadingMore,
      error,
      searchQuery,
      filters,
      currentPage,
      totalPages,
      hasMore,
      observerTarget,
      debouncedSearch,
      resetAndFetch,
      clearSearch,
      getRatingColor,
      handleSortByChange,
      fetchPlayers,
      loadMore,
      viewPlayer
    }
  }
}
</script>
