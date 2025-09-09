package com.ngp.TheaterService.DTO.Response;

import com.ngp.TheaterService.Contrains.ScreenType;
import com.ngp.TheaterService.Contrains.SoundSystem;
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
