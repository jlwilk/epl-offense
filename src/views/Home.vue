<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center space-y-6">
      <h1 class="text-4xl md:text-6xl font-bold text-gradient">
        Premier League Statistics
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Comprehensive analysis of the English Premier League with real-time data, team performance metrics, and player statistics.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <router-link to="/standings" class="btn-primary text-lg px-8 py-3">
          View Standings
        </router-link>
        <router-link to="/teams" class="btn-secondary text-lg px-8 py-3">
          Explore Teams
        </router-link>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ quickStats.teams || '20' }}</div>
          <div class="text-blue-100">Teams</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ quickStats.season || '2025' }}</div>
          <div class="text-blue-100">Season</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ quickStats.fixtures || '380' }}</div>
          <div class="text-blue-100">Fixtures</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="text-center">
          <div class="text-3xl font-bold">{{ quickStats.players || '500+' }}</div>
          <div class="text-blue-100">Players</div>
        </div>
      </div>
    </div>

    <!-- Live Fixtures Section -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Live Fixtures</h2>
        <router-link to="/fixtures" class="text-epl-blue hover:text-epl-purple font-medium">
          View All →
        </router-link>
      </div>
      
      <div v-if="liveFixtures.length === 0" class="text-center py-8 text-gray-500">
        <div class="text-6xl mb-4">⚽</div>
        <p>No live fixtures at the moment</p>
        <p class="text-sm">Check back later for live matches</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="fixture in liveFixtures.slice(0, 3)" 
          :key="`${fixture.fixture?.id || fixture.id}-${fixture.fixture?.status?.elapsed || fixture.elapsed || 0}-${fixture.fixture?.status?.extra || 0}`"
          class="bg-gradient-to-r from-epl-blue to-epl-purple text-white rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="text-sm opacity-75">{{ fixture.league?.name }}</div>
              <div class="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">
                LIVE
              </div>
            </div>
            <div class="text-sm opacity-75">{{ getStatusText(fixture.fixture?.status?.elapsed || fixture.status) }}'</div>
          </div>
          
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-3">
              <!-- Home Team Logo -->
              <div class="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img 
                  v-if="fixture.teams?.home?.logo" 
                  :src="fixture.teams.home.logo" 
                  :alt="fixture.teams.home.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
                <span v-else class="text-epl-blue font-bold text-xs">
                  {{ (fixture.teams?.home?.name || 'H')?.charAt(0) }}
                </span>
              </div>
              <span class="font-semibold">{{ fixture.teams?.home?.name }}</span>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold">{{ fixture.goals?.home || 0 }} - {{ fixture.goals?.away || 0 }}</div>
              <div class="text-xs opacity-75">
                <span v-if="fixture.fixture?.status?.short === 'LIVE' || fixture.fixture?.status?.short === 'HT'">
                  {{ formatMatchTime(fixture.elapsed || fixture.fixture?.status?.elapsed, fixture.fixture?.status?.extra) }}'
                </span>
                <span v-else>{{ getStatusText(fixture.fixture?.status?.elapsed || fixture.status) }}'</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <span class="font-semibold">{{ fixture.teams?.away?.name }}</span>
              <!-- Away Team Logo -->
              <div class="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img 
                  v-if="fixture.teams?.away?.logo" 
                  :src="fixture.teams.away.logo" 
                  :alt="fixture.teams.away.name"
                  class="w-full h-full object-cover"
                  @error="$event.target.style.display='none'"
                />
                <span v-else class="text-epl-blue font-bold text-xs">
                  {{ (fixture.teams?.away?.name || 'A')?.charAt(0) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Access Sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Teams Section -->
      <div class="card hover:shadow-xl transition-shadow duration-300">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-gradient-to-br from-epl-blue to-epl-purple rounded-full flex items-center justify-center mx-auto">
            <span class="text-white text-2xl">🏆</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Teams</h3>
          <p class="text-gray-600">Explore all Premier League teams, their statistics, and performance metrics.</p>
          <router-link to="/teams" class="btn-primary w-full">
            View Teams
          </router-link>
        </div>
      </div>

      <!-- Players Section -->
      <div class="card hover:shadow-xl transition-shadow duration-300">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-gradient-to-br from-epl-gold to-epl-red rounded-full flex items-center justify-center mx-auto">
            <span class="text-white text-2xl">⚽</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Players</h3>
          <p class="text-gray-600">Discover top performers, goal scorers, and defensive leaders in the league.</p>
          <router-link to="/players" class="btn-primary w-full">
            View Players
          </router-link>
        </div>
      </div>

      <!-- Defense Section -->
      <div class="card hover:shadow-xl transition-shadow duration-300">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-gradient-to-br from-epl-green to-epl-blue rounded-full flex items-center justify-center mx-auto">
            <span class="text-white text-2xl">🛡️</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Defense</h3>
          <p class="text-gray-600">Analyze defensive performance, clean sheets, and defensive statistics.</p>
          <router-link to="/defense" class="btn-primary w-full">
            View Defense
          </router-link>
        </div>
      </div>
    </div>

    <!-- Top Performers Preview -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Top Performers</h2>
        <router-link to="/players" class="text-epl-blue hover:text-epl-purple font-medium">
          View All →
        </router-link>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Top Scorers -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="text-epl-gold mr-2">🥇</span>
            Top Scorers
          </h3>
          <div v-if="loading.topScorers" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-epl-blue mx-auto"></div>
          </div>
          <div v-else-if="topScorers.length > 0" class="space-y-3">
            <div 
              v-for="(player, index) in topScorers.slice(0, 5)" 
              :key="player.player?.id || player.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="text-lg font-bold text-epl-gold">{{ index + 1 }}</span>
                <div>
                  <div class="font-medium">{{ player.player?.name || player.name }}</div>
                  <div class="text-sm text-gray-500">{{ player.statistics?.[0]?.team?.name }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-epl-red">{{ player.statistics?.[0]?.goals?.total || 0 }}</div>
                <div class="text-xs text-gray-500">goals</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Assists -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="text-epl-blue mr-2">🎯</span>
            Top Assists
          </h3>
          <div v-if="loading.topAssists" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-epl-blue mx-auto"></div>
          </div>
          <div v-else-if="topAssists.length > 0" class="space-y-3">
            <div 
              v-for="(player, index) in topAssists.slice(0, 5)" 
              :key="player.player?.id || player.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span class="text-lg font-bold text-epl-blue">{{ index + 1 }}</span>
                <div>
                  <div class="font-medium">{{ player.player?.name || player.name }}</div>
                  <div class="text-sm text-gray-500">{{ player.statistics?.[0]?.team?.name }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-epl-purple">{{ player.statistics?.[0]?.goals?.assists || 0 }}</div>
                <div class="text-xs text-gray-500">assists</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fixturesAPI, playerStatsAPI } from '../services/api'

export default {
  name: 'Home',
  setup() {
    const liveFixtures = ref([])
    const topScorers = ref([])
    const topAssists = ref([])
    const quickStats = ref({
      teams: 20,
      season: 2025,
      fixtures: 380,
      players: '500+'
    })
    
    const loading = ref({
      topScorers: false,
      topAssists: false
    })

    const fetchLiveFixtures = async () => {
      try {
        const data = await fixturesAPI.getLiveFixtures()
        
        if (data && data.response) {
          // Handle response structure
          const newFixtures = Array.isArray(data.response) ? data.response : []
          // Only update if data actually changed to prevent flashing
          if (JSON.stringify(newFixtures) !== JSON.stringify(liveFixtures.value)) {
            liveFixtures.value = newFixtures
          }
        } else if (Array.isArray(data)) {
          // Handle direct array
          const newFixtures = data
          if (JSON.stringify(newFixtures) !== JSON.stringify(liveFixtures.value)) {
            liveFixtures.value = newFixtures
          }
        } else if (data && data.fixture) {
          // Handle single fixture object (unwrapped by interceptor)
          const newFixtures = [data]
          if (JSON.stringify(newFixtures) !== JSON.stringify(liveFixtures.value)) {
            liveFixtures.value = newFixtures
          }
        } else {
          if (liveFixtures.value.length > 0) {
            liveFixtures.value = []
          }
        }
      } catch (error) {
        console.error('Error fetching live fixtures:', error)
        // Only clear if we had data before
        if (liveFixtures.value.length > 0) {
          liveFixtures.value = []
        }
      }
    }

    const fetchTopScorers = async () => {
      loading.value.topScorers = true
      try {
        const data = await playerStatsAPI.getTopScorers(39, 2025, { limit: 5 })
        
        if (data && data.response) {
          // Handle response structure
          topScorers.value = Array.isArray(data.response) ? data.response : []
        } else if (Array.isArray(data)) {
          // Handle direct array
          topScorers.value = data
        } else {
          topScorers.value = []
        }
      } catch (error) {
        console.error('Error fetching top scorers:', error)
        topScorers.value = []
      } finally {
        loading.value.topScorers = false
      }
    }

    const fetchTopAssists = async () => {
      loading.value.topAssists = true
      try {
        const data = await playerStatsAPI.getTopAssists(39, 2025, { limit: 5 })
        
        if (data && data.response) {
          // Handle response structure
          topAssists.value = Array.isArray(data.response) ? data.response : []
        } else if (Array.isArray(data)) {
          // Handle direct array
          topAssists.value = data
        } else {
          topAssists.value = []
        }
      } catch (error) {
        console.error('Error fetching top assists:', error)
        topAssists.value = []
      } finally {
        loading.value.topAssists = false
      }
    }

    // Helper function for status text
    const getStatusText = (status) => {
      switch (status) {
        case 'LIVE': return 'LIVE'
        case 'FT': return 'FT'
        case 'NS': return 'Not Started'
        case 'HT': return 'HT'
        case '1H': return '1H'
        case '2H': return '2H'
        default: return status || 'Unknown'
      }
    }

    // Helper function to format match time with extra time
    const formatMatchTime = (elapsed, extra) => {
      if (!elapsed && elapsed !== 0) return 'N/A'
      
      let timeDisplay = elapsed.toString()
      if (extra && extra > 0) {
        timeDisplay += `+${extra}`
      }
      return timeDisplay + "'"
    }

    // Update elapsed time for live fixtures
    const updateElapsedTime = () => {
      if (liveFixtures.value.length > 0) {
        // Trigger reactivity by creating a new array reference
        liveFixtures.value = [...liveFixtures.value]
      }
    }

    onMounted(() => {
      fetchLiveFixtures()
      fetchTopScorers()
      fetchTopAssists()
      
      // Refresh live fixtures every 30 seconds (silent update)
      setInterval(fetchLiveFixtures, 30000)
      
      // Update elapsed time every minute for live fixtures
      setInterval(updateElapsedTime, 60000)
    })

    return {
      liveFixtures,
      topScorers,
      topAssists,
      quickStats,
      loading,
      getStatusText,
      formatMatchTime
    }
  }
}
</script>
