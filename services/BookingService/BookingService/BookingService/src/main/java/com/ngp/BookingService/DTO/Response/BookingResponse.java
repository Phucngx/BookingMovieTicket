package com.ngp.BookingService.DTO.Response;

import com.ngp.BookingService.Constrains.StatusType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BookingResponse {
    Long bookingId;
    Long accountId;
    Long showtimeId;
    StatusType status;
    Double totalPrice;
    Long ticketId;
}

