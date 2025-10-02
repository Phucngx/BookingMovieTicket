package com.ngp.TheaterService.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomSeatDTO {
    Long seatId;
    Character seatRow;  // 'A', 'B', ...
    Integer seatNumber; // 1..n
    String seatType;    // STANDARD/VIP... (enum name)
}
