<template>
  <div class="space-y-6">
    <div class="card">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">🔧 API Endpoint Testing Dashboard</h1>
      <p class="text-gray-600 mb-6">
        This page tests all API endpoints to verify response structures and data handling.
      </p>
      
      <!-- Test Controls -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button 
          @click="runAllTests" 
          class="btn-primary"
          :disabled="runningTests"
        >
          {{ runningTests ? 'Running Tests...' : '🚀 Run All Tests' }}
        </button>
        <button 
          @click="clearResults" 
          class="btn-secondary"
        >
          🗑️ Clear Results
        </button>
      </div>
    </div>

    <!-- Test Results -->
    <div v-for="(result, endpoint) in testResults" :key="endpoint" class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ endpoint }}</h3>
        <div class="flex items-center space-x-2">
          <span 
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              result.status === 'success' ? 'bg-green-100 text-green-800' : 
              result.status === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-800'
            ]"
          >
            {{ result.status }}
          </span>
          <span class="text-sm text-gray-500">{{ result.duration }}ms</span>
        </div>
      </div>
      
      <!-- Response Structure -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Response Structure:</h4>
        <div class="bg-gray-50 rounded-lg p-3 text-sm font-mono">
          <div v-if="result.data">
            <div><strong>Results:</strong> {{ result.data.results || 'N/A' }}</div>
            <div><strong>Response Type:</strong> {{ Array.isArray(result.data.response) ? 'Array' : 'Object' }}</div>
            <div v-if="result.data.response && Array.isArray(result.data.response)">
              <strong>Items:</strong> {{ result.data.response.length }}
              <div v-if="result.data.response.length > 0" class="mt-2">
                <strong>First Item Structure:</strong>
                <pre class="text-xs mt-1">{{ JSON.stringify(result.data.response[0], null, 2) }}</pre>
              </div>
            </div>
            <div v-else-if="result.data.response">
              <strong>Response Structure:</strong>
              <pre class="text-xs mt-1">{{ JSON.stringify(result.data.response, null, 2) }}</pre>
            </div>
          </div>
          <div v-else-if="result.error" class="text-red-600">
            {{ result.error }}
          </div>
        </div>
      </div>
      
      <!-- Raw Response -->
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">Raw Response:</h4>
        <details class="bg-gray-50 rounded-lg p-3">
          <summary class="cursor-pointer text-sm font-medium text-gray-600">Click to expand</summary>
          <pre class="text-xs mt-2 overflow-auto">{{ JSON.stringify(result.data || result.error, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="Object.keys(testResults).length > 0" class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Test Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ successCount }}</div>
          <div class="text-sm text-gray-500">Successful</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ errorCount }}</div>
          <div class="text-sm text-gray-500">Failed</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalCount }}</div>
          <div class="text-sm text-gray-500">Total</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  teamsAPI, 
  fixturesAPI, 
  standingsAPI, 
  teamStatsAPI, 
  playerStatsAPI, 
  ingestionAPI, 
  healthAPI, 
  leaguesAPI 
} from '../services/api'

export default {
  name: 'ApiTest',
  setup() {
    const testResults = ref({})
    const runningTests = ref(false)

    // Define all endpoints to test
    const endpoints = {
      // Leagues
      'GET /leagues/': () => leaguesAPI.getLeagues(),
      
      // Teams
      'GET /teams/': () => teamsAPI.getTeams({ season: 2025 }),
      'GET /teams/33': () => teamsAPI.getTeam(33),
      'GET /teams/33/statistics': () => teamsAPI.getTeamStats(33, { season: 2025 }),
      'GET /teams/33/fixtures': () => teamsAPI.getTeamFixtures(33, { season: 2025, last: 5 }),
      'GET /teams/33/players': () => teamsAPI.getTeamPlayers(33, { season: 2025 }),
      
      // Fixtures
      'GET /fixtures/': () => fixturesAPI.getFixtures({ season: 2025, league: 39 }),
      'GET /fixtures/live': () => fixturesAPI.getLiveFixtures(),
      
      // Standings
      'GET /standings/': () => standingsAPI.getStandings({ season: 2025, league: 39 }),
      

      
      // Team Stats
      'GET /team-stats/33/overview': () => teamStatsAPI.getTeamOverview(33, { season: 2025, league: 39 }),
      
      // Player Stats
      'GET /player-stats/league/39': () => playerStatsAPI.getLeaguePlayerStats(39, { season: 2025 }),
      'GET /player-stats/top-scorers': () => playerStatsAPI.getTopScorers(39, 2025, { limit: 5 }),
      'GET /player-stats/top-assists': () => playerStatsAPI.getTopAssists(39, 2025, { limit: 5 }),
      
      // Health
      'GET /health': () => healthAPI.health(),
      'GET /ingestion/health': () => ingestionAPI.health(),
    }

    const runAllTests = async () => {
      runningTests.value = true
      testResults.value = {}
      
      for (const [endpoint, testFn] of Object.entries(endpoints)) {
        const startTime = Date.now()
        
        try {
          console.log(`Testing ${endpoint}...`)
          const data = await testFn()
          
          testResults.value[endpoint] = {
            status: 'success',
            data,
            duration: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
          
          console.log(`✅ ${endpoint} - Success:`, data)
        } catch (error) {
          testResults.value[endpoint] = {
            status: 'error',
            error: error.message || 'Unknown error',
            duration: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
          
          console.error(`❌ ${endpoint} - Error:`, error)
        }
      }
      
      runningTests.value = false
    }

    const clearResults = () => {
      testResults.value = {}
    }

    const successCount = computed(() => 
      Object.values(testResults.value).filter(r => r.status === 'success').length
    )
    
    const errorCount = computed(() => 
      Object.values(testResults.value).filter(r => r.status === 'error').length
    )
    
    const totalCount = computed(() => Object.keys(testResults.value).length)

    return {
      testResults,
      runningTests,
      runAllTests,
      clearResults,
      successCount,
      errorCount,
      totalCount
    }
  }
}
</script>
