package com.ngp.BookingService.Repository.HttpClient;

import com.ngp.BookingService.DTO.Request.HoldRequest;
import com.ngp.BookingService.DTO.Request.ReserveRequest;
import com.ngp.BookingService.DTO.Response.ApiResponse;
import com.ngp.BookingService.DTO.Response.HoldResult;
import com.ngp.BookingService.DTO.Response.ReserveResult;
import com.ngp.BookingService.DTO.Response.ShowtimeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "showtime-service", url = "http://localhost:8084/showtime-service/showtimes"
//        , configuration = {
//            AuthenticationRequestInterceptor.class
//        }
)
public interface ShowtimeClient {
    @PostMapping(value = "/internal/seat-holds", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<HoldResult> holdSeat(@RequestBody HoldRequest request);

    @PostMapping(value = "/internal/seat-reservations", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<ReserveResult> reserveSeat(@RequestBody ReserveRequest request);

    @GetMapping(value = "/get-detail/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<ShowtimeResponse> getShowtimeDetail(@PathVariable Long id);

    @DeleteMapping(value = "/internal/seat-holds/cancel/{holdId}", produces = MediaType.APPLICATION_JSON_VALUE)
    void cancelSeatHold(@PathVariable("holdId") String holdId);
}
