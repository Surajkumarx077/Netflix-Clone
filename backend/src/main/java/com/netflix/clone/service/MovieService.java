package com.netflix.clone.service;

import com.netflix.clone.dto.MovieDTO;
import com.netflix.clone.entity.Movie;
import com.netflix.clone.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO getMovieById(Long id) {
        return movieRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<MovieDTO> getTrendingMovies() {
        return movieRepository.findTrendingMovies().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDTO> getMoviesByGenre(String genre) {
        return movieRepository.findMoviesByGenre(genre).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO createMovie(MovieDTO movieDTO) {
        Movie movie = Movie.builder()
                .title(movieDTO.getTitle())
                .description(movieDTO.getDescription())
                .posterPath(movieDTO.getPosterPath())
                .backdropPath(movieDTO.getBackdropPath())
                .videoUrl(movieDTO.getVideoUrl())
                .rating(movieDTO.getRating())
                .releaseDate(movieDTO.getReleaseDate())
                .isTrending(movieDTO.getIsTrending())
                .genres(movieDTO.getGenres())
                .build();
        
        Movie savedMovie = movieRepository.save(movie);
        return convertToDTO(savedMovie);
    }

    public MovieDTO updateMovie(Long id, MovieDTO movieDTO) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        if (movieDTO.getTitle() != null) movie.setTitle(movieDTO.getTitle());
        if (movieDTO.getDescription() != null) movie.setDescription(movieDTO.getDescription());
        if (movieDTO.getPosterPath() != null) movie.setPosterPath(movieDTO.getPosterPath());
        if (movieDTO.getBackdropPath() != null) movie.setBackdropPath(movieDTO.getBackdropPath());
        if (movieDTO.getVideoUrl() != null) movie.setVideoUrl(movieDTO.getVideoUrl());
        if (movieDTO.getRating() != null) movie.setRating(movieDTO.getRating());
        if (movieDTO.getReleaseDate() != null) movie.setReleaseDate(movieDTO.getReleaseDate());
        if (movieDTO.getIsTrending() != null) movie.setIsTrending(movieDTO.getIsTrending());
        if (movieDTO.getGenres() != null) movie.setGenres(movieDTO.getGenres());

        Movie updatedMovie = movieRepository.save(movie);
        return convertToDTO(updatedMovie);
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Movie not found");
        }
        movieRepository.deleteById(id);
    }

    private MovieDTO convertToDTO(Movie movie) {
        return MovieDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .videoUrl(movie.getVideoUrl())
                .rating(movie.getRating())
                .releaseDate(movie.getReleaseDate())
                .isTrending(movie.getIsTrending())
                .genres(movie.getGenres())
                .build();
    }
}
