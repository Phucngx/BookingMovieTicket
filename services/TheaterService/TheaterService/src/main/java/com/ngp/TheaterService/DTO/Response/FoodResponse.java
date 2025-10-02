package com.ngp.TheaterService.DTO.Response;

import com.ngp.TheaterService.Contrains.FoodType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodResponse {
    Long foodId;
    String foodName;
    FoodType foodType;
    Double price;
    String foodUrl;
}
