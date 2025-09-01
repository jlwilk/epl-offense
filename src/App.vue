<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-epl-blue to-epl-purple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span class="text-white font-bold text-xl">⚽</span>
              </div>
              <div>
                <span class="text-2xl font-bold text-gradient">EPL Stats</span>
                <div class="text-xs text-gray-500 -mt-1">Premier League Hub</div>
              </div>
            </router-link>
          </div>
          
          <div class="hidden md:flex items-center space-x-2">
            <router-link 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              :class="[
                $route.path === item.href ? 'nav-link-active-enhanced' : 'nav-link-enhanced'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-600 hover:text-epl-blue p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-50">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/20 backdrop-blur-sm"
          @click="mobileMenuOpen = false"
        ></div>
        
        <!-- Menu panel -->
        <div class="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg animate-slide-down">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <router-link 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              @click="mobileMenuOpen = false"
              :class="[
                $route.path === item.href ? 'nav-link-active-enhanced' : 'nav-link-enhanced',
                'block w-full'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-16">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4">
          <div class="flex justify-center items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-epl-blue to-epl-purple rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">⚽</span>
            </div>
            <span class="text-xl font-bold text-gradient">EPL Stats</span>
          </div>
          <p class="text-gray-600">Comprehensive Premier League statistics and analysis platform</p>
          <p class="text-sm text-gray-500">&copy; 2024 EPL Stats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      mobileMenuOpen: false,
      navigation: [
        { name: 'Home', href: '/' },
        { name: 'Teams', href: '/teams' },
        { name: 'Players', href: '/players' },
        { name: 'Fixtures', href: '/fixtures' },
        { name: 'Standings', href: '/standings' },
        { name: 'API Test', href: '/api-test' },
      ]
    }
  }
}
</script>
