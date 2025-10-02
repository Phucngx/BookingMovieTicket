package com.ngp.TheaterService.DTO.Request;

import com.ngp.TheaterService.Contrains.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequest{
    Character seatRow;
    Integer seatNumber;
    SeatType seatType;
    Long roomId;
}
