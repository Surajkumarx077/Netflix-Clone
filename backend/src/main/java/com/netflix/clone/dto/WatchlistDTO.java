package com.netflix.clone.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistDTO {
    private Long id;
    private MovieDTO movie;
    private String addedAt;
}
