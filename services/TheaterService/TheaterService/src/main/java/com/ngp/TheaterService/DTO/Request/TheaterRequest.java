package com.ngp.TheaterService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterRequest {
    String theaterName;
    String city;
    String district;
    String address;
    String phone;
    String managerName;
}
