import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Watchlist from './pages/Watchlist';
import VideoPlayer from './pages/VideoPlayer';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import { userService } from './services/userService';

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = userService.isLoggedIn();
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/watchlist" element={<ProtectedRoute element={<Watchlist />} />} />
          <Route path="/player" element={<VideoPlayer />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
