// Supabase configuration
const SUPABASE_URL = 'https://edbxgzcbqzsdcganxfbl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYnhnemNicXpzZGNnYW54ZmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTQ2NTgsImV4cCI6MjA1NjIzMDY1OH0.nsBTaO4yHfzWRMQLcoytAkeJlWv_l_0lVAF80JpNOJY';

// Initialize Supabase client with error handling
let supabaseClient;
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client initialized successfully");
  } else {
    console.warn("Supabase library not loaded, using local storage fallback");
    supabaseClient = null;
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  supabaseClient = null;
}

// Function to save score to leaderboard
async function saveScore(nickname, score) {
  try {
    // If Supabase client is not available, use local storage
    if (!supabaseClient || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      saveScoreLocally(nickname, score);
      return null;
    }
    
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .insert([
        { nickname, score }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving score:', error);
    saveScoreLocally(nickname, score);
    return null;
  }
}

// Function to get top 5 scores
async function getTopScores() {
  try {
    // If Supabase client is not available, use local storage
    if (!supabaseClient || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      return getLocalLeaderboard();
    }
    
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    return getLocalLeaderboard();
  }
}

// Local storage fallback functions
function saveScoreLocally(nickname, score) {
  // Get existing scores
  let scores = JSON.parse(localStorage.getItem('beerGameScores') || '[]');
  
  // Add new score
  scores.push({ nickname, score });
  
  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);
  
  // Keep only top 10
  scores = scores.slice(0, 10);
  
  // Save back to local storage
  localStorage.setItem('beerGameScores', JSON.stringify(scores));
  console.log("Score saved locally");
}

function getLocalLeaderboard() {
  // Get scores from local storage
  let scores = JSON.parse(localStorage.getItem('beerGameScores') || '[]');
  
  // Return top 5
  return scores.slice(0, 5);
} 