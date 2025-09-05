<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-epl-blue/5 via-epl-purple/5 to-epl-gold/5"></div>
      <div class="absolute inset-0 bg-pattern opacity-50"></div>
      
      <div class="relative z-10 text-center space-y-8 py-16 px-4">
        <!-- Animated Badge -->
        <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-epl-blue to-epl-purple text-white px-6 py-3 rounded-full shadow-lg animate-bounce-gentle">
          <span class="text-2xl">⚽</span>
          <span class="font-semibold">Premier League 2024/25</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold text-gradient leading-tight">
          Premier League
          <span class="block text-4xl md:text-5xl mt-2 text-gray-700">Statistics Hub</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Comprehensive analysis of the English Premier League with real-time data, 
          <span class="font-semibold text-epl-blue">team performance metrics</span>, and 
          <span class="font-semibold text-epl-purple">player statistics</span>.
        </p>
        
        <div class="flex flex-wrap justify-center gap-6 pt-4">
          <router-link to="/standings" class="group relative overflow-hidden bg-gradient-to-r from-epl-blue to-epl-purple text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <span class="relative z-10">View Standings</span>
            <div class="absolute inset-0 bg-gradient-to-r from-epl-purple to-epl-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </router-link>
          <router-link to="/teams" class="group relative overflow-hidden bg-white text-epl-blue font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-epl-blue">
            <span class="relative z-10">Explore Teams</span>
            <div class="absolute inset-0 bg-epl-blue opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="px-4 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="group stat-card-enhanced transform hover:scale-105 transition-all duration-300">
            <div class="text-center space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white group-hover:text-epl-gold transition-colors duration-300">
                {{ quickStats.teams || '20' }}
              </div>
              <div class="text-blue-100 font-medium">Premier League Teams</div>
              <div class="w-8 h-1 bg-epl-gold mx-auto rounded-full opacity-60"></div>
            </div>
          </div>
          <div class="group stat-card-enhanced transform hover:scale-105 transition-all duration-300">
            <div class="text-center space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white group-hover:text-epl-gold transition-colors duration-300">
                {{ quickStats.season || '2025' }}
              </div>
              <div class="text-blue-100 font-medium">Current Season</div>
              <div class="w-8 h-1 bg-epl-gold mx-auto rounded-full opacity-60"></div>
            </div>
          </div>
          <div class="group stat-card-enhanced transform hover:scale-105 transition-all duration-300">
            <div class="text-center space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white group-hover:text-epl-gold transition-colors duration-300">
                {{ quickStats.fixtures || '380' }}
              </div>
              <div class="text-blue-100 font-medium">Total Fixtures</div>
              <div class="w-8 h-1 bg-epl-gold mx-auto rounded-full opacity-60"></div>
            </div>
          </div>
          <div class="group stat-card-enhanced transform hover:scale-105 transition-all duration-300">
            <div class="text-center space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white group-hover:text-epl-gold transition-colors duration-300">
                {{ quickStats.players || '500+' }}
              </div>
              <div class="text-blue-100 font-medium">Active Players</div>
              <div class="w-8 h-1 bg-epl-gold mx-auto rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixtures Section -->
    <div class="px-4 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="card-enhanced">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">⚽</span>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900">{{ fixturesSectionTitle }}</h2>
                <p class="text-gray-600">Latest match updates and schedules</p>
              </div>
            </div>
            <router-link to="/fixtures" class="group flex items-center space-x-2 text-epl-blue hover:text-epl-purple font-semibold transition-colors duration-200">
              <span>View All</span>
              <span class="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </router-link>
          </div>
          
          <div v-if="displayFixtures.length === 0" class="text-center py-16">
            <div class="text-8xl mb-6 animate-bounce-gentle">⚽</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ noFixturesMessage }}</h3>
            <p class="text-gray-600">{{ noFixturesSubMessage }}</p>
          </div>
          
          <div v-else class="space-y-6">
            <div 
              v-for="fixture in displayFixtures.slice(0, 3)" 
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
            
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
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
                      <!-- <span :class="isLiveFixture(fixture) ? 'text-epl-blue font-bold text-lg' : 'text-gray-700 font-bold text-lg'">
                        {{ (fixture.teams?.home?.name || 'H')?.charAt(0) }}
                      </span> -->
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
                      <!-- <span :class="isLiveFixture(fixture) ? 'text-epl-blue font-bold text-lg' : 'text-gray-700 font-bold text-lg'">
                        {{ (fixture.teams?.away?.name || 'A')?.charAt(0) }}
                      </span> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Access Sections -->
    <div class="px-4 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Teams Section -->
          <div class="quick-access-card group">
            <div class="text-center space-y-6">
              <div class="quick-access-icon teams-icon">
                <span class="text-white text-3xl">🏆</span>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Teams</h3>
                <p class="text-gray-600 leading-relaxed">Explore all Premier League teams, their statistics, and performance metrics.</p>
              </div>
              <router-link to="/teams" class="quick-access-btn">
                View Teams
              </router-link>
            </div>
          </div>

          <!-- Players Section -->
          <div class="quick-access-card group">
            <div class="text-center space-y-6">
              <div class="quick-access-icon players-icon">
                <span class="text-white text-3xl">⚽</span>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Players</h3>
                <p class="text-gray-600 leading-relaxed">Discover top performers, goal scorers, and defensive leaders in the league.</p>
              </div>
              <router-link to="/players" class="quick-access-btn">
                View Players
              </router-link>
            </div>
          </div>

          <!-- Fixtures Section -->
          <div class="quick-access-card group">
            <div class="text-center space-y-6">
              <div class="quick-access-icon fixtures-icon">
                <span class="text-white text-3xl">📅</span>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Fixtures</h3>
                <p class="text-gray-600 leading-relaxed">View upcoming matches, live scores, and fixture schedules for the season.</p>
              </div>
              <router-link to="/fixtures" class="quick-access-btn">
                View Fixtures
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Performers Preview -->
    <div class="px-4 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="card-enhanced">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-epl-gold to-epl-red rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">🏅</span>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900">Top Performers</h2>
                <p class="text-gray-600">League leaders and statistics</p>
              </div>
            </div>
            <router-link to="/players" class="group flex items-center space-x-2 text-epl-blue hover:text-epl-purple font-semibold transition-colors duration-200">
              <span>View All</span>
              <span class="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </router-link>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Scorers -->
            <div class="performers-section">
              <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span class="text-2xl mr-3">🥇</span>
                Top Scorers
              </h3>
              <div v-if="loading.topScorers" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-epl-blue mx-auto"></div>
              </div>
              <div v-else-if="topScorers.length > 0" class="space-y-4">
                <div 
                  v-for="(player, index) in topScorers.slice(0, 5)" 
                  :key="player.player?.id || player.id"
                  class="performer-card cursor-pointer hover:shadow-lg transition-all duration-200"
                  @click="viewPlayer(player.player?.id || player.id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="rank-badge rank-gold">{{ index + 1 }}</div>
                      <div class="player-photo">
                        <img 
                          v-if="player.player?.photo" 
                          :src="player.player.photo" 
                          :alt="player.player?.name || player.name"
                          class="w-full h-full object-cover"
                          @error="$event.target.style.display='none'"
                        />
                        <div v-else class="player-photo-fallback">
                          <span class="text-white font-bold text-lg">
                            {{ (player.player?.name || player.name || 'P')?.charAt(0) }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-gray-900">{{ player.player?.name || player.name }}</div>
                        <div class="text-sm text-gray-500">{{ player.statistics?.[0]?.team?.name }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-epl-red">{{ player.statistics?.[0]?.goals?.total || 0 }}</div>
                      <div class="text-xs text-gray-500 uppercase tracking-wide">goals</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Assists -->
            <div class="performers-section">
              <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span class="text-2xl mr-3">🎯</span>
                Top Assists
              </h3>
              <div v-if="loading.topAssists" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-epl-blue mx-auto"></div>
              </div>
              <div v-else-if="topAssists.length > 0" class="space-y-4">
                <div 
                  v-for="(player, index) in topAssists.slice(0, 5)" 
                  :key="player.player?.id || player.id"
                  class="performer-card cursor-pointer hover:shadow-lg transition-all duration-200"
                  @click="viewPlayer(player.player?.id || player.id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="rank-badge rank-blue">{{ index + 1 }}</div>
                      <div class="player-photo">
                        <img 
                          v-if="player.player?.photo" 
                          :src="player.player.photo" 
                          :alt="player.player?.name || player.name"
                          class="w-full h-full object-cover"
                          @error="$event.target.style.display='none'"
                        />
                        <div v-else class="player-photo-fallback">
                          <span class="text-white font-bold text-lg">
                            {{ (player.player?.name || player.name || 'P')?.charAt(0) }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-gray-900">{{ player.player?.name || player.name }}</div>
                        <div class="text-sm text-gray-500">{{ player.statistics?.[0]?.team?.name }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-epl-purple">{{ player.statistics?.[0]?.goals?.assists || 0 }}</div>
                      <div class="text-xs text-gray-500 uppercase tracking-wide">assists</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fixturesAPI, playerStatsAPI } from '../services/api'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const liveFixtures = ref([])
    const upcomingFixtures = ref([])
    const displayFixtures = ref([])
    const fixturesMode = ref('live') // 'live' or 'upcoming'
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

    // Smart polling system
    const livePollingInterval = ref(null)
    const upcomingPollingInterval = ref(null)
    const elapsedTimeInterval = ref(null)
    const isLivePollingActive = ref(false)

    const fetchLiveFixtures = async () => {
      try {
        const data = await fixturesAPI.getLiveFixtures()
        
        if (data && data.response) {
          const newFixtures = Array.isArray(data.response) ? data.response : []
          if (JSON.stringify(newFixtures) !== JSON.stringify(liveFixtures.value)) {
            liveFixtures.value = newFixtures
          }
        } else if (Array.isArray(data)) {
          const newFixtures = data
          if (JSON.stringify(newFixtures) !== JSON.stringify(liveFixtures.value)) {
            liveFixtures.value = newFixtures
          }
        } else if (data && data.fixture) {
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
        if (liveFixtures.value.length > 0) {
          liveFixtures.value = []
        }
      }
    }

    const fetchUpcomingFixtures = async () => {
      try {
        const data = await fixturesAPI.getFixtures({ 
          league: 39, 
          season: 2025, 
          status: 'NS',
          limit: 10 
        })
        
        if (data && data.response) {
          const newFixtures = Array.isArray(data.response) ? data.response : []
          if (JSON.stringify(newFixtures) !== JSON.stringify(upcomingFixtures.value)) {
            upcomingFixtures.value = newFixtures
          }
        } else if (Array.isArray(data)) {
          const newFixtures = data
          if (JSON.stringify(newFixtures) !== JSON.stringify(upcomingFixtures.value)) {
            upcomingFixtures.value = newFixtures
          }
        } else {
          if (upcomingFixtures.value.length > 0) {
            upcomingFixtures.value = []
          }
        }
        
        // Check if any upcoming fixtures should be live now
        checkForLiveFixtures()
      } catch (error) {
        console.error('Error fetching upcoming fixtures:', error)
        if (upcomingFixtures.value.length > 0) {
          upcomingFixtures.value = []
        }
      }
    }

    // Smart function to check if we should start polling for live fixtures
    const checkForLiveFixtures = () => {
      const now = new Date()
      const hasUpcomingFixtures = upcomingFixtures.value.length > 0
      
      if (!hasUpcomingFixtures) {
        // No upcoming fixtures, no need to poll for live
        stopLivePolling()
        return
      }
      
      // Check if any upcoming fixtures are within 30 minutes of start time
      const shouldStartPolling = upcomingFixtures.value.some(fixture => {
        const fixtureDate = new Date(fixture.fixture?.date || fixture.date)
        const timeDiff = fixtureDate.getTime() - now.getTime()
        const minutesDiff = timeDiff / (1000 * 60)
        
        // Start polling 30 minutes before match time
        return minutesDiff <= 30 && minutesDiff > -90 // Within 30 min before or 90 min after
      })
      
      if (shouldStartPolling && !isLivePollingActive.value) {
        startLivePolling()
      } else if (!shouldStartPolling && isLivePollingActive.value) {
        stopLivePolling()
      }
    }

    // Start live fixtures polling
    const startLivePolling = () => {
      if (isLivePollingActive.value) return
      
      console.log('Starting live fixtures polling')
      isLivePollingActive.value = true
      
      // Fetch live fixtures immediately
      fetchLiveFixtures()
      
      // Then poll every 30 seconds
      livePollingInterval.value = setInterval(fetchLiveFixtures, 30000)
    }

    // Stop live fixtures polling
    const stopLivePolling = () => {
      if (!isLivePollingActive.value) return
      
      console.log('Stopping live fixtures polling')
      isLivePollingActive.value = false
      
      if (livePollingInterval.value) {
        clearInterval(livePollingInterval.value)
        livePollingInterval.value = null
      }
      
      // Clear live fixtures if no longer polling
      if (liveFixtures.value.length > 0) {
        liveFixtures.value = []
        updateDisplayFixtures()
      }
    }

    const updateDisplayFixtures = () => {
      if (liveFixtures.value.length > 0) {
        displayFixtures.value = liveFixtures.value
        fixturesMode.value = 'live'
      } else {
        displayFixtures.value = upcomingFixtures.value
        fixturesMode.value = 'upcoming'
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

    // Computed properties
    const fixturesSectionTitle = computed(() => {
      return fixturesMode.value === 'live' ? 'Live Fixtures' : 'Upcoming Fixtures'
    })

    const noFixturesMessage = computed(() => {
      return fixturesMode.value === 'live' 
        ? 'No live fixtures at the moment' 
        : 'No upcoming fixtures available'
    })

    const noFixturesSubMessage = computed(() => {
      return fixturesMode.value === 'live' 
        ? 'Check back later for live matches' 
        : 'Check the fixtures page for more details'
    })

    // Helper functions
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

    // Helper function for status text (legacy)
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

    // Helper function to format match time with extra time (legacy)
    const formatMatchTime = (elapsed, extra) => {
      if (!elapsed && elapsed !== 0) return 'N/A'
      
      let timeDisplay = elapsed.toString()
      if (extra && extra > 0) {
        timeDisplay += `+${extra}`
      }
      return timeDisplay + "'"
    }

    // Navigation function for players
    const viewPlayer = (playerId) => {
      router.push(`/players/${playerId}`)
    }

    // Update elapsed time for live fixtures
    const updateElapsedTime = () => {
      if (displayFixtures.value.length > 0 && fixturesMode.value === 'live') {
        // Trigger reactivity by creating a new array reference
        displayFixtures.value = [...displayFixtures.value]
      }
    }

    onMounted(() => {
      // Start with upcoming fixtures first
      fetchUpcomingFixtures()
      fetchTopScorers()
      fetchTopAssists()
      
      // Update display fixtures after initial fetch
      setTimeout(updateDisplayFixtures, 1000)
      
      // Refresh upcoming fixtures every 5 minutes
      upcomingPollingInterval.value = setInterval(fetchUpcomingFixtures, 300000)
      
      // Update display fixtures and elapsed time every minute
      elapsedTimeInterval.value = setInterval(() => {
        updateDisplayFixtures()
        updateElapsedTime()
      }, 60000)
    })

    // Cleanup intervals on component unmount
    onUnmounted(() => {
      if (livePollingInterval.value) {
        clearInterval(livePollingInterval.value)
      }
      if (upcomingPollingInterval.value) {
        clearInterval(upcomingPollingInterval.value)
      }
      if (elapsedTimeInterval.value) {
        clearInterval(elapsedTimeInterval.value)
      }
    })

    return {
      liveFixtures,
      upcomingFixtures,
      displayFixtures,
      fixturesMode,
      topScorers,
      topAssists,
      quickStats,
      loading,
      fixturesSectionTitle,
      noFixturesMessage,
      noFixturesSubMessage,
      isLiveFixture,
      getFixtureStatus,
      getFixtureTime,
      getFixtureTimeDisplay,
      getStatusText,
      formatMatchTime,
      viewPlayer
    }
  }
}
</script>
