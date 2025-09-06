// Team name to logo file mapping
export const teamLogos = {
  // Arsenal
  'Arsenal': '/logos/teams/Arsenal-FC-logo.png',
  'Arsenal FC': '/logos/teams/Arsenal-FC-logo.png',
  
  // Aston Villa
  'Aston Villa': '/logos/teams/Aston-Villa-FC-logo.png',
  'Aston Villa FC': '/logos/teams/Aston-Villa-FC-logo.png',
  
  // Bournemouth
  'Bournemouth': '/logos/teams/AFC-Bournemouth-logo.png',
  'AFC Bournemouth': '/logos/teams/AFC-Bournemouth-logo.png',
  
  // Brentford
  'Brentford': '/logos/teams/Brentford-FC-logo.png',
  'Brentford FC': '/logos/teams/Brentford-FC-logo.png',
  
  // Brighton
  'Brighton': '/logos/teams/Brighton-Hove-Albion-logo.png',
  'Brighton & Hove Albion': '/logos/teams/Brighton-Hove-Albion-logo.png',
  'Brighton and Hove Albion': '/logos/teams/Brighton-Hove-Albion-logo.png',
  
  // Burnley
  'Burnley': '/logos/teams/Burnley-FC-logo-1.png',
  'Burnley FC': '/logos/teams/Burnley-FC-logo-1.png',
  
  // Chelsea
  'Chelsea': '/logos/teams/Chelsea-FC-logo.png',
  'Chelsea FC': '/logos/teams/Chelsea-FC-logo.png',
  
  // Crystal Palace
  'Crystal Palace': '/logos/teams/Crystal-Palace-FC-logo.png',
  'Crystal Palace FC': '/logos/teams/Crystal-Palace-FC-logo.png',
  
  // Everton
  'Everton': '/logos/teams/Everton-FC-logo.png',
  'Everton FC': '/logos/teams/Everton-FC-logo.png',
  
  // Fulham
  'Fulham': '/logos/teams/Fulham-FC-logo.png',
  'Fulham FC': '/logos/teams/Fulham-FC-logo.png',
  
  // Leeds United
  'Leeds': '/logos/teams/Leeds-United-FC-logo.png',
  'Leeds United': '/logos/teams/Leeds-United-FC-logo.png',
  'Leeds United FC': '/logos/teams/Leeds-United-FC-logo.png',
  
  // Liverpool
  'Liverpool': '/logos/teams/Liverpool-FC-logo.png',
  'Liverpool FC': '/logos/teams/Liverpool-FC-logo.png',
  
  // Manchester City
  'Manchester City': '/logos/teams/Manchester-City-FC-logo.png',
  'Man City': '/logos/teams/Manchester-City-FC-logo.png',
  'Man. City': '/logos/teams/Manchester-City-FC-logo.png',
  
  // Manchester United
  'Manchester United': '/logos/teams/Manchester-United-FC-logo.png',
  'Man United': '/logos/teams/Manchester-United-FC-logo.png',
  'Man. United': '/logos/teams/Manchester-United-FC-logo.png',
  'Man Utd': '/logos/teams/Manchester-United-FC-logo.png',
  
  // Newcastle United
  'Newcastle': '/logos/teams/Newcastle-United-logo.png',
  'Newcastle United': '/logos/teams/Newcastle-United-logo.png',
  'Newcastle United FC': '/logos/teams/Newcastle-United-logo.png',
  
  // Nottingham Forest
  'Nottingham Forest': '/logos/teams/Nottingham-Forest-FC-logo.png',
  'Nottingham Forest FC': '/logos/teams/Nottingham-Forest-FC-logo.png',
  'Nott\'ham Forest': '/logos/teams/Nottingham-Forest-FC-logo.png',
  
  // Sunderland
  'Sunderland': '/logos/teams/Sunderland-logo.png',
  'Sunderland AFC': '/logos/teams/Sunderland-logo.png',
  
  // Tottenham
  'Tottenham': '/logos/teams/Tottenham-Hotspur-logo.png',
  'Tottenham Hotspur': '/logos/teams/Tottenham-Hotspur-logo.png',
  'Tottenham Hotspur FC': '/logos/teams/Tottenham-Hotspur-logo.png',
  'Spurs': '/logos/teams/Tottenham-Hotspur-logo.png',
  
  // West Ham
  'West Ham': '/logos/teams/West-Ham-United-FC-logo.png',
  'West Ham United': '/logos/teams/West-Ham-United-FC-logo.png',
  'West Ham United FC': '/logos/teams/West-Ham-United-FC-logo.png',
  
  // Wolverhampton
  'Wolves': '/logos/teams/Wolverhampton-Wanderers-logo.png',
  'Wolverhampton': '/logos/teams/Wolverhampton-Wanderers-logo.png',
  'Wolverhampton Wanderers': '/logos/teams/Wolverhampton-Wanderers-logo.png',
  'Wolverhampton Wanderers FC': '/logos/teams/Wolverhampton-Wanderers-logo.png'
}

// League logos
export const leagueLogos = {
  'Premier League': '/logos/leagues/Premier-League-Logo.png',
  'English Premier League': '/logos/leagues/Premier-League-Logo.png',
  'EPL': '/logos/leagues/Premier-League-Logo.png'
}

// Function to get team logo
export const getTeamLogo = (teamName) => {
  if (!teamName) return null
  
  // Try exact match first
  if (teamLogos[teamName]) {
    return teamLogos[teamName]
  }
  
  // Try case-insensitive match
  const lowerTeamName = teamName.toLowerCase()
  for (const [key, logo] of Object.entries(teamLogos)) {
    if (key.toLowerCase() === lowerTeamName) {
      return logo
    }
  }
  
  // Try partial match (for variations)
  for (const [key, logo] of Object.entries(teamLogos)) {
    if (key.toLowerCase().includes(lowerTeamName) || lowerTeamName.includes(key.toLowerCase())) {
      return logo
    }
  }
  
  return null
}

// Function to get league logo
export const getLeagueLogo = (leagueName) => {
  if (!leagueName) return null
  
  // Try exact match first
  if (leagueLogos[leagueName]) {
    return leagueLogos[leagueName]
  }
  
  // Try case-insensitive match
  const lowerLeagueName = leagueName.toLowerCase()
  for (const [key, logo] of Object.entries(leagueLogos)) {
    if (key.toLowerCase() === lowerLeagueName) {
      return logo
    }
  }
  
  return null
}

// Function to get team name from logo path (for debugging)
export const getTeamNameFromLogo = (logoPath) => {
  const fileName = logoPath.split('/').pop()
  const teamName = fileName.replace('-logo.png', '').replace('-FC-logo.png', '').replace('-logo-1.png', '')
  return teamName.replace(/-/g, ' ')
}

