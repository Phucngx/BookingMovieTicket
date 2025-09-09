package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ReserveResult {
    List<Long> reservedSeatIds;
}
