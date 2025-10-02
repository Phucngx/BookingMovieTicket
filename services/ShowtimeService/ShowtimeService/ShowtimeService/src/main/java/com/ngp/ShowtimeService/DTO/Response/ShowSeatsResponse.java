package com.ngp.ShowtimeService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowSeatsResponse {
    SeatLayout layout;
    List<SeatViewResponse> seats;

}
