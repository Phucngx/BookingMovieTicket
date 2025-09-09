package com.ngp.TheaterService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {
    Long theaterId;
    String theaterName;
    String city;
    String district;
    String address;
    String phone;
    String managerName;
    Integer totalRooms;
}
