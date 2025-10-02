package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoldResult {
    String holdId;          // mã hold (HOLD-xxx)
    LocalDateTime expiresAt; // thời gian hết hạn
}
