package com.ngp.BookingService.DTO.Response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RangeResponse {
    private LocalDateTime start;
    private LocalDateTime end;
}
