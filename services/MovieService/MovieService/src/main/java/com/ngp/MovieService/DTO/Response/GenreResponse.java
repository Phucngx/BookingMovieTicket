package com.ngp.MovieService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenreResponse {
    Long genreId;
    String genreName;
    String description;
    LocalDateTime createdAt;
}
