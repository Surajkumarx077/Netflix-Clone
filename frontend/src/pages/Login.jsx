import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiClient';
import { userService } from '../services/userService';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.signup(email, fullName, password);
      }

      userService.setUser(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Image Setup */}
      <div className="login-bg">
        <img 
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f85718e8-fc6d-4954-bca0-f5faaf7dc8eb/ea083b40-dd28-4ceb-8ea9-a0bd83ed81da/US-en-20231023-popsignuptwoweeks-perspective_alpha_website_large.jpg" 
          alt="Netflix Background" 
          className="bg-img"
        />
        <div className="bg-overlay"></div>
      </div>

      {/* Basic brand logo for Login Header */}
      <div className="login-header">
        <Link to="/" className="brand-logo">NETFLIX CLONE</Link>
      </div>

      <div className="login-card glass-panel">
        <h2 className="login-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        
        {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-base" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email or phone number" 
            className="input-base" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-base" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          
          {isLogin && (
            <div className="login-help">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#help" className="help-link">Need help?</a>
            </div>
          )}
        </form>

        <div className="login-footer">
          <p className="signup-text">
            {isLogin ? 'New to Netflix Clone? ' : 'Already have an account? '}
            <span 
              className="signup-link" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up now.' : 'Sign in.'}
            </span>
          </p>
          <p className="recaptcha-text">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#learn-more">Learn more.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
