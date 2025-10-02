package com.ngp.BookingService.DTO.Response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingFullResponse {
    Long bookingId;
    Long accountId;
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

