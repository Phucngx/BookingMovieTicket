package com.ngp.BookingService.DTO.Response;

import com.ngp.BookingService.Constrains.StatusType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingFullResponse {
    Long bookingId;
    String userName;
    String movieName;
    LocalDateTime startTime;
    LocalDateTime endTime;
    String theaterName;
    String roomName;
    List<String> foodNames;
    List<String> seatNames;
    StatusType status;
    Double totalPrice;
    LocalDateTime createdAt;
    String qrCode;
}

