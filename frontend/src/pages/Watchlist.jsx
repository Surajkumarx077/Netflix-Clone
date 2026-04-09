import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../api/apiClient';
import { userService } from '../services/userService';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const userId = userService.getUserId();
        if (!userId) {
          setError('Please log in to view your watchlist');
          setLoading(false);
          return;
        }
        const data = await watchlistAPI.getWatchlist(userId);
        setWatchlist(data);
      } catch (err) {
        setError('Failed to load watchlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My List</h1>
      </div>
      
      {error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <p>Your watchlist is empty.</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(item => (
            <MovieCard key={item.id} movie={item.movie} watchlistId={item.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
