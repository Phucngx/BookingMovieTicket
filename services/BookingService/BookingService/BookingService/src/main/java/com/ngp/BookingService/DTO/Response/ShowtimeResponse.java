package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeResponse {
    Long showtimeId;
    LocalDateTime startTime;
    LocalDateTime endTime;
    Double price;
    Long movieId;
    Long roomId;
}
