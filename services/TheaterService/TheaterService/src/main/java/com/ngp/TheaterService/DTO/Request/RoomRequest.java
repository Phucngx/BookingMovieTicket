package com.ngp.TheaterService.DTO.Request;

import com.ngp.TheaterService.Contrains.ScreenType;
import com.ngp.TheaterService.Contrains.SoundSystem;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    String roomName;
    ScreenType screenType;
    SoundSystem soundSystem;
    Long theaterId;
}
