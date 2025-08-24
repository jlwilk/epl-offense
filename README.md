# EPL Stats - Premier League Statistics App

A beautiful, modern Vue 3 application for exploring English Premier League statistics, team performance, and player data. Built with Vue 3, Vite, and Tailwind CSS.

## 🚀 Features

- **Comprehensive Team Analysis**: View team statistics, standings, and performance metrics
- **Player Statistics**: Detailed player performance data with season comparisons
- **Live Fixtures**: Real-time match updates and fixture information
- **Defensive Analysis**: Specialized defensive statistics and rankings
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Data**: Live updates from the EPL Defense API

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Components**: Headless UI + Heroicons
- **Charts**: Chart.js with Vue-Chartjs

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Access to the EPL Defense API (running on `http://127.0.0.1:8001`)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── Home.vue        # Dashboard with live fixtures
│   ├── Teams.vue       # Team listing and search
│   ├── TeamDetail.vue  # Individual team analysis
│   ├── Players.vue     # Player listing and search
│   ├── PlayerDetail.vue # Individual player stats
│   ├── Fixtures.vue    # Match fixtures and results
│   ├── Standings.vue   # League table
│   └── Defense.vue     # Defensive statistics
├── services/           # API service layer
│   └── api.js         # HTTP client and API endpoints
├── style.css           # Global styles and Tailwind imports
├── main.js            # Vue app entry point
└── App.vue            # Root component with navigation
```

## 🔌 API Integration

The app integrates with the EPL Defense API, providing access to:

- **Teams**: Team information, statistics, and performance data
- **Players**: Individual player statistics and comparisons
- **Fixtures**: Match schedules, results, and live updates
- **Standings**: League table and team rankings
- **Defense**: Specialized defensive metrics and analysis

### API Endpoints Used

- `/teams/*` - Team management and statistics
- `/players/*` - Player statistics and rankings
- `/fixtures/*` - Match fixtures and results
- `/standings/*` - League standings
- `/defense/*` - Defensive statistics
- `/team-stats/*` - Team performance metrics
- `/player-stats/*` - Player performance data

## 🎨 Customization

### Colors

The app uses a custom EPL-themed color palette defined in `tailwind.config.js`:

- `epl-blue`: Primary brand color
- `epl-purple`: Secondary brand color
- `epl-gold`: Accent color for highlights
- `epl-red`: Error and warning colors
- `epl-green`: Success and positive colors

### Styling

Custom CSS classes are defined in `src/style.css`:

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card component styling
- `.stat-card` - Statistics card styling
- `.nav-link` - Navigation link styling

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first design approach
- Responsive grid layouts
- Collapsible navigation menu
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔧 Development

### Adding New Views

1. Create a new Vue component in `src/views/`
2. Add the route in `src/main.js`
3. Update navigation in `src/App.vue`

### Adding New API Endpoints

1. Extend the API service in `src/services/api.js`
2. Import and use in your components
3. Handle loading states and errors

### Styling Guidelines

- Use Tailwind CSS utility classes when possible
- Create custom component classes for repeated patterns
- Follow the established color scheme
- Ensure responsive design for all components

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files in `dist/` can be deployed to:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_APP_TITLE=EPL Stats
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify the API server is running
3. Check network connectivity
4. Review the API documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications for live matches
- [ ] Advanced filtering and search capabilities
- [ ] Data visualization with charts and graphs
- [ ] User accounts and favorites
- [ ] Mobile app (PWA)
- [ ] Dark mode theme
- [ ] Multi-language support

---

Built with ❤️ for Premier League fans
