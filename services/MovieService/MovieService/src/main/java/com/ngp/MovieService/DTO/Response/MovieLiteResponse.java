package com.ngp.MovieService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieLiteResponse {
    Long id;
    String title;
    String posterUrl;
    String trailerUrl;
    List<String> genres;
    Integer rating;
    Integer durationMinutes;
}
