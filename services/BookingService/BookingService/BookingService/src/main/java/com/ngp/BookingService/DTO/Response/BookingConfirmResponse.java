package com.ngp.BookingService.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmResponse {
    private Long bookingId;
    private String status;          // CONFIRMED
    private List<Long> seatIds;
    private Long ticketId;
}
