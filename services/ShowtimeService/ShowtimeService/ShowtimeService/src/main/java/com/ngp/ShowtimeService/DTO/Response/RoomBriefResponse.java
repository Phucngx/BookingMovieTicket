package com.ngp.ShowtimeService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomBriefResponse {
    Long roomId;
    String roomName;
    Integer totalSeats;
    Long theaterId;
}
