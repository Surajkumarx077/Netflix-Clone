import React, { useState } from 'react';
import { Play, Plus, X } from 'lucide-react';
import { watchlistAPI } from '../api/apiClient';
import { userService } from '../services/userService';
import './MovieCard.css';

const MovieCard = ({ movie, watchlistId, onRemove }) => {
  const [adding, setAdding] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(!!watchlistId);

  const handleAddToWatchlist = async () => {
    try {
      setAdding(true);
      const userId = userService.getUserId();
      if (!userId) {
        alert('Please log in to add movies to watchlist');
        return;
      }
      await watchlistAPI.addToWatchlist(userId, movie.id);
      setInWatchlist(true);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
      alert('Failed to add movie to watchlist');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      setAdding(true);
      const userId = userService.getUserId();
      await watchlistAPI.removeFromWatchlist(userId, movie.id);
      setInWatchlist(false);
      if (onRemove) onRemove();
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
      alert('Failed to remove movie from watchlist');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="movie-card">
      <img src={movie.posterPath} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h4 className="movie-title">{movie.title}</h4>
        <div className="movie-actions">
          <button className="action-btn play"><Play size={16} fill="currentColor" /></button>
          <button 
            className="action-btn add" 
            onClick={inWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
            disabled={adding}
          >
            {inWatchlist ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>
        <p className="movie-desc">{movie.genres?.join(' • ')}</p>
      </div>
    </div>
  );
};

export default MovieCard;
