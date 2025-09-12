package com.ngp.ShowtimeService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatLayout {
    Long roomId;
    Integer rows;    // max rowIndex + 1
    Integer cols;    // max colIndex + 1
}
