package com.ngp.BookingService.DTO.Response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueResponse {
    private String period;                // today|week|month|year
    private List<String> labels;          // trục X
    private List<SeriesResponse> series;          // dữ liệu
    private Double total;                 // tổng doanh thu
    private RangeResponse range;                  // khoảng thời gian (server time)

    public static RevenueResponse of(String period, List<String> labels, List<Double> data,
                                     double total, LocalDateTime start, LocalDateTime end) {
        return RevenueResponse.builder()
                .period(period)
                .labels(labels)
                .series(List.of(new SeriesResponse("Revenue", data)))
                .total(total)
                .range(new RangeResponse(start, end))
                .build();
    }
}
