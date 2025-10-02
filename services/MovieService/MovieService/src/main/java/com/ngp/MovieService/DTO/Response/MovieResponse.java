package com.ngp.MovieService.DTO.Response;

import com.ngp.MovieService.Entity.DirectorEntity;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    Long id;
    String title;
    String description;
    LocalDate releaseDate;
    Integer rating;
    Integer durationMinutes;
    String language;
    String country;
    String posterUrl;
    String trailerUrl;
    String bannerUrl;
    Set<GenreResponse> genres;
    DirectorResponse director;
    Set<ActorResponse> actors;
}
