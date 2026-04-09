import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { userService } from '../services/userService';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const refreshUser = () => {
      const currentUser = userService.getUser();
      setUser(currentUser);
    };

    refreshUser();
    window.addEventListener('auth-changed', refreshUser);
    window.addEventListener('storage', refreshUser);

    return () => {
      window.removeEventListener('auth-changed', refreshUser);
      window.removeEventListener('storage', refreshUser);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="brand-logo">NETFLIX CLONE</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {user && <li><Link to="/watchlist">My List</Link></li>}
        </ul>
      </div>
      
      <div className="navbar-right">
        <button className="icon-btn"><Search size={22} /></button>
        {user && <button className="icon-btn"><Bell size={22} /></button>}
        <div className="profile-menu" style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: 'pointer' }}
          >
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={22} />
                <span style={{ fontSize: '12px' }}>{user.fullName?.split(' ')[0]}</span>
              </div>
            ) : (
              <User size={22} />
            )}
          </button>
          
          {showMenu && user && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#141414',
              border: '1px solid #333',
              borderRadius: '4px',
              marginTop: '10px',
              zIndex: 1000,
              minWidth: '200px'
            }}>
              <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{user.fullName}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: 'none',
                  border: 'none',
                  color: '#e50914',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
          
          {showMenu && !user && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#141414',
              border: '1px solid #333',
              borderRadius: '4px',
              marginTop: '10px',
              zIndex: 1000
            }}>
              <Link 
                to="/login"
                style={{
                  display: 'block',
                  padding: '12px 15px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
