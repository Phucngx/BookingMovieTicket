package com.ngp.BookingService.DTO.Response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeriesResponse {
    private String name;
    private List<Double> data;
}
