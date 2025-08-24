import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import components
import Home from './views/Home.vue'
import Teams from './views/Teams.vue'
import TeamDetail from './views/TeamDetail.vue'
import Players from './views/Players.vue'
import PlayerDetail from './views/PlayerDetail.vue'
import Fixtures from './views/Fixtures.vue'
import Standings from './views/Standings.vue'
import Defense from './views/Defense.vue'
import ApiTest from './views/ApiTest.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/teams', name: 'Teams', component: Teams },
    { path: '/teams/:id', name: 'TeamDetail', component: TeamDetail, props: true },
    { path: '/players', name: 'Players', component: Players },
    { path: '/players/:id', name: 'PlayerDetail', component: PlayerDetail, props: true },
    { path: '/fixtures', name: 'Fixtures', component: Fixtures },
    { path: '/standings', name: 'Standings', component: Standings },
    { path: '/defense', name: 'Defense', component: Defense },
  { path: '/api-test', name: 'ApiTest', component: ApiTest },
  ]
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
