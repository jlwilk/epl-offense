#!/usr/bin/env node

/**
 * Simple API Endpoint Testing Script
 * Run with: node test-endpoints.js
 */

import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8001';

// Test specific endpoints
const endpoints = [
  '/leagues/',
  '/teams/?season=2025&league=39',
  '/teams/33',
  '/teams/33/statistics?season=2025',
  '/teams/33/fixtures?season=2025&last=5',
  '/teams/33/players?season=2025',
  '/fixtures/?season=2025&league=39',
  '/fixtures/live',
  '/standings/?season=2025&league=39',
  '/defense/table?season=2025&league=39',
  '/team-stats/33/overview?season=2025&league=39',
  '/player-stats/league/39?season=2025',
  '/player-stats/top-scorers?league=39&season=2025&limit=5',
  '/player-stats/top-assists?league=39&season=2025&limit=5',
  '/health',
  '/ingestion/health'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    console.log('─'.repeat(50));
    
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    const duration = Date.now() - startTime;
    
    const data = response.data;
    
    console.log(`✅ Status: ${response.status} (${duration}ms)`);
    console.log(`📊 Results: ${data.results || 'N/A'}`);
    console.log(`📝 Response Type: ${Array.isArray(data.response) ? 'Array' : 'Object'}`);
    
    if (data.response && Array.isArray(data.response)) {
      console.log(`📦 Items: ${data.response.length}`);
      
      if (data.response.length > 0) {
        const firstItem = data.response[0];
        console.log(`🔍 First Item Keys: ${Object.keys(firstItem).join(', ')}`);
        
        // Check for nested structures
        if (firstItem.team && firstItem.team.name) {
          console.log(`🏟️  Nested Structure: team.team.name = ${firstItem.team.name}`);
        } else if (firstItem.name) {
          console.log(`🏟️  Flat Structure: name = ${firstItem.name}`);
        }
        
        if (firstItem.venue && firstItem.venue.name) {
          console.log(`🏟️  Nested Structure: venue.venue.name = ${firstItem.venue.name}`);
        } else if (firstItem.venue_name) {
          console.log(`🏟️  Flat Structure: venue_name = ${firstItem.venue_name}`);
        }
      }
    } else if (data.response) {
      console.log(`🔍 Response Keys: ${Object.keys(data.response).join(', ')}`);
    }
    
    // Show pagination info
    if (data.paging) {
      console.log(`📄 Pagination: Page ${data.paging.current} of ${data.paging.total}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📅 ${new Date().toLocaleString()}`);
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n🎉 All tests completed!');
}

// Run the tests
runAllTests().catch(console.error);
