package com.ngp.BookingService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PaymentCallbackRequest {
    Long paymentId;
    String status; // SUCCESS | FAILED
}
