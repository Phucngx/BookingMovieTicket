package com.ngp.TheaterService.DTO.Response;

import com.ngp.TheaterService.Contrains.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    Long seatId;
    Character seatRow;
    Integer seatNumber;
    SeatType seatType;
    RoomResponse room;
}
