package com.ngp.BookingService.DTO.Response;

import com.ngp.BookingService.Constrains.StatusType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingResponse {
    Long bookingId;
    String status;
    Integer amount;
    String holdId;
    LocalDateTime holdExpiresAt;
    String qrUrl;
}

