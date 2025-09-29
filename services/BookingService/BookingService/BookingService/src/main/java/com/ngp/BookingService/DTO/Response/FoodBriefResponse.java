package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodBriefResponse {
    Long foodId;
    String foodName;
    Double price;
    String foodUrl;
}
