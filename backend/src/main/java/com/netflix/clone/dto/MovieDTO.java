package com.netflix.clone.dto;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private String posterPath;
    private String backdropPath;
    private String videoUrl;
    private Double rating;
    private String releaseDate;
    private Boolean isTrending;
    private Set<String> genres;
}
