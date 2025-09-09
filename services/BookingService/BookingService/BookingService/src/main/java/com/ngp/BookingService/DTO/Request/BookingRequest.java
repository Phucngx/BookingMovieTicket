package com.ngp.BookingService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    Long accountId;
    Long showtimeId;
    List<Long> seatIds;
}
