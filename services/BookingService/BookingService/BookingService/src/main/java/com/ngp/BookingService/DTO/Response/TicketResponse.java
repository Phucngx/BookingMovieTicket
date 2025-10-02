package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TicketResponse {
    Long bookingId;
    String movieName;
    LocalDateTime startTime;
    LocalDateTime endTime;
    String theaterName;
    String roomName;
    List<String> foodNames;
    List<String> seatNames;
    LocalDateTime createdAt;
    String qrCode;
}

