// API Service for Netflix Clone Backend
// Configure your backend base URL here

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// ========== Authentication APIs ==========
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email, fullName, password) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, password }),
    }),
};

// ========== Movies APIs ==========
export const moviesAPI = {
  getAllMovies: () => apiCall('/movies'),

  getMovieById: (id) => apiCall(`/movies/${id}`),

  getTrendingMovies: () => apiCall('/movies/trending/all'),

  getMoviesByGenre: (genre) => apiCall(`/movies/genre/${genre}`),

  createMovie: (movieData) =>
    apiCall('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    }),

  updateMovie: (id, movieData) =>
    apiCall(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    }),

  deleteMovie: (id) =>
    apiCall(`/movies/${id}`, {
      method: 'DELETE',
    }),
};

// ========== Watchlist APIs ==========
export const watchlistAPI = {
  getWatchlist: (userId) => apiCall(`/watchlist/${userId}`),

  addToWatchlist: (userId, movieId) =>
    apiCall(`/watchlist/${userId}/add/${movieId}`, {
      method: 'POST',
    }),

  removeFromWatchlist: (userId, movieId) =>
    apiCall(`/watchlist/${userId}/remove/${movieId}`, {
      method: 'DELETE',
    }),
};

export default {
  authAPI,
  moviesAPI,
  watchlistAPI,
};
