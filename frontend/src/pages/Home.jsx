import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { moviesAPI } from '../api/apiClient';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [allMovies, trending] = await Promise.all([
          moviesAPI.getAllMovies(),
          moviesAPI.getTrendingMovies()
        ]);
        setMovies(allMovies);
        setTrendingMovies(trending);
      } catch (err) {
        setError('Failed to load movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;

  const featuredMovie = trendingMovies[0] || movies[0];

  return (
    <div className="home-container">
      {featuredMovie && (
        <div className="billboard">
          <div className="billboard-image-wrapper">
            <img className="billboard-img" src={featuredMovie.backdropPath} alt="Featured" />
            <div className="billboard-vignette"></div>
          </div>
          <div className="billboard-info">
            <h1 className="billboard-title">{featuredMovie.title}</h1>
            <p className="billboard-desc">{featuredMovie.description}</p>
            <div className="billboard-actions">
              <button className="btn-primary play-btn">
                <Play size={20} fill="currentColor" /> Play
              </button>
              <button className="btn-secondary info-btn">
                <Info size={20} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      <div className="rows-container">
        {trendingMovies.length > 0 && (
          <div className="movie-row">
            <h2 className="row-title">Trending Now</h2>
            <div className="row-slider">
              {trendingMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {movies.length > 0 && (
          <div className="movie-row">
            <h2 className="row-title">All Movies</h2>
            <div className="row-slider">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
