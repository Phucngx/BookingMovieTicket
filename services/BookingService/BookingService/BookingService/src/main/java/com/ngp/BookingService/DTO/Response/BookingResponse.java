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
    String status;          // PENDING
    Integer amount;         // tổng tiền (đổi sang Integer VND nếu muốn)
    String holdId;
    LocalDateTime holdExpiresAt;
    String qrUrl;
}

