package com.ngp.ShowtimeService.DTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeItemDTO {
    Long id;
    String time;     // "HH:mm" từ startTime
    Double price;
    Long roomId;
    String status;
}
