package com.ngp.TheaterService.DTO.Request;

import com.ngp.TheaterService.Contrains.FoodType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodRequest {
    String foodName;
    Double price;
    FoodType foodType;
    String foodUrl;
}
