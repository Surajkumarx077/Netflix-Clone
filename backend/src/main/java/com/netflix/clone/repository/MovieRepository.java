package com.netflix.clone.repository;

import com.netflix.clone.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTitle(String title);
    
    @Query("SELECT m FROM Movie m WHERE m.isTrending = true")
    List<Movie> findTrendingMovies();
    
    @Query("SELECT m FROM Movie m WHERE :genre MEMBER OF m.genres")
    List<Movie> findMoviesByGenre(String genre);
}
