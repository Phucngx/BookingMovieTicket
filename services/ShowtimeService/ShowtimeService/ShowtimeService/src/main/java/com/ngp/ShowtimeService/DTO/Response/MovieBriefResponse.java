package com.ngp.ShowtimeService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieBriefResponse {
    Long movieId;
    String title;
    Integer durationMinutes;
}
