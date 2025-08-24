<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-epl-blue to-epl-purple rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">⚽</span>
              </div>
              <span class="text-xl font-bold text-gradient">EPL Stats</span>
            </router-link>
          </div>
          
          <div class="hidden md:flex items-center space-x-1">
            <router-link 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              :class="[
                $route.path === item.href ? 'nav-link-active' : 'nav-link'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-600 hover:text-epl-blue p-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            @click="mobileMenuOpen = false"
            :class="[
              $route.path === item.href ? 'nav-link-active' : 'nav-link',
              'block w-full'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500">
          <p>&copy; 2024 EPL Stats. Premier League statistics and analysis.</p>
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
                       { name: 'Defense', href: '/defense' },
               { name: 'API Test', href: '/api-test' },
      ]
    }
  }
}
</script>
