package com.ngp.TheaterService.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    Long roomId;
    String roomName;
    Integer capacity;
}
