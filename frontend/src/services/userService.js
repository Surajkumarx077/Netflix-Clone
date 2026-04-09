// User service for authentication state management

export const userService = {
  // Save user data and token to localStorage
  setUser(userData, token) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    window.dispatchEvent(new Event('auth-changed'));
  },

  // Get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  },

  // Get user ID
  getUserId() {
    const user = this.getUser();
    return user?.id;
  },

  // Logout user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.dispatchEvent(new Event('auth-changed'));
  },
};

export default userService;
