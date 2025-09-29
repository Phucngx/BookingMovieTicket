package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatBriefResponse {
    Long seatId;
    Character seatRow;
    Integer seatNumber;
}
