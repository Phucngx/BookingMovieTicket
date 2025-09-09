package com.ngp.MovieService.DTO.Request;

import com.ngp.MovieService.Entity.ActorEntity;
import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.GenreEntity;
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
public class MovieRequest {
    String title;
    String description;
    LocalDate releaseDate;
    String language;
    String country;
    String posterUrl;
    String trailerUrl;
    Integer durationMinutes;
    Set<Long> genreId;
    Set<Long> actorId;
    Long directorId;
}
