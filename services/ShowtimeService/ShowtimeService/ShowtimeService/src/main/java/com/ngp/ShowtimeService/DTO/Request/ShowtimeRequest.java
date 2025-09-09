package com.ngp.ShowtimeService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeRequest {
    LocalDateTime startTime;
    LocalDateTime endTime;
    Double price;
    Long movieId;
    Long roomId;
}
