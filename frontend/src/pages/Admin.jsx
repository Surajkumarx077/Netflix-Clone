import React, { useState } from 'react';
import { moviesAPI } from '../api/apiClient';
import './Admin.css';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterPath: '',
    backdropPath: '',
    videoUrl: '',
    genre: 'Action',
    rating: 'PG-13',
    releaseDate: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        posterPath: formData.posterPath,
        backdropPath: formData.backdropPath,
        videoUrl: formData.videoUrl,
        genre: formData.genre,
        rating: formData.rating,
        releaseDate: formData.releaseDate
      };

      await moviesAPI.createMovie(movieData);
      setSuccess(true);
      setFormData({ 
        title: '', 
        description: '', 
        posterPath: '', 
        backdropPath: '', 
        videoUrl: '', 
        genre: 'Action',
        rating: 'PG-13',
        releaseDate: new Date().toISOString().split('T')[0]
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload movie. Please try again.');
      console.error('Error uploading movie:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card glass-panel">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Upload New Movie</p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ff1744', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            backgroundColor: '#00c853', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            ✓ Movie uploaded successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-form">
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Movie Title" 
            className="input-base" 
            required 
          />
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description" 
            className="input-base" 
            rows="3"
            required 
          />
          <input 
            type="url" 
            name="posterPath"
            value={formData.posterPath}
            onChange={handleChange}
            placeholder="Poster Image URL" 
            className="input-base" 
            required 
          />
          <input 
            type="url" 
            name="backdropPath"
            value={formData.backdropPath}
            onChange={handleChange}
            placeholder="Backdrop Image URL" 
            className="input-base" 
            required 
          />
          <input 
            type="url" 
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="Video URL (e.g. mp4 link)" 
            className="input-base" 
            required 
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="select-wrapper">
              <select 
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="input-base select-input"
              >
                <option value="Action">Action</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Comedy">Comedy</option>
                <option value="Horror">Horror</option>
                <option value="Drama">Drama</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>
            
            <div className="select-wrapper">
              <select 
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="input-base select-input"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>
          </div>
          
          <input 
            type="date" 
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="input-base" 
            required 
          />
          
          <button 
            type="submit" 
            className="btn-primary upload-btn"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
