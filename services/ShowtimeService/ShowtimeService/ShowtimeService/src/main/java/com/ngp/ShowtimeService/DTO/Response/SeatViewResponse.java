package com.ngp.ShowtimeService.DTO.Response;

import com.ngp.ShowtimeService.Constrains.SeatStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatViewResponse {
    Long seatId;
    String code;        // ví dụ "A01"
    Character seatRow;  // 'A'
    Integer seatNumber; // 1..n
    Integer rowIndex;   // 0-based -> 'A' -> 0
    Integer colIndex;   // 0-based -> seatNumber-1
    String seatType;    // STANDARD/VIP...
    Double price;       // lấy từ ShowtimeEntity.price
    SeatStatus status;  // AVAILABLE/HOLD/BOOKED
}
