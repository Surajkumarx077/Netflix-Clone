package com.netflix.clone.service;

import com.netflix.clone.dto.WatchlistDTO;
import com.netflix.clone.entity.Movie;
import com.netflix.clone.entity.User;
import com.netflix.clone.entity.Watchlist;
import com.netflix.clone.repository.MovieRepository;
import com.netflix.clone.repository.UserRepository;
import com.netflix.clone.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieService movieService;

    public List<WatchlistDTO> getWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WatchlistDTO addToWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Check if already in watchlist
        if (watchlistRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            throw new RuntimeException("Movie already in watchlist");
        }

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .movie(movie)
                .build();

        Watchlist savedWatchlist = watchlistRepository.save(watchlist);
        return convertToDTO(savedWatchlist);
    }

    public void removeFromWatchlist(Long userId, Long movieId) {
        if (!watchlistRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            throw new RuntimeException("Movie not in watchlist");
        }
        watchlistRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    private WatchlistDTO convertToDTO(Watchlist watchlist) {
        return WatchlistDTO.builder()
                .id(watchlist.getId())
                .movie(movieService.getMovieById(watchlist.getMovie().getId()))
                .addedAt(watchlist.getAddedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();
    }
}
