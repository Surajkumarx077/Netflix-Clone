package com.netflix.clone.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.netflix.clone.dto.WatchlistDTO;
import com.netflix.clone.service.WatchlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/watchlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost", "http://127.0.0.1", "http://localhost:5173", "http://localhost:3000"})
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<WatchlistDTO>> getWatchlist(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getWatchlist(userId));
    }

    @PostMapping("/{userId}/add/{movieId}")
    public ResponseEntity<WatchlistDTO> addToWatchlist(@PathVariable Long userId, @PathVariable Long movieId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(watchlistService.addToWatchlist(userId, movieId));
    }

    @DeleteMapping("/{userId}/remove/{movieId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long userId, @PathVariable Long movieId) {
        watchlistService.removeFromWatchlist(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}
