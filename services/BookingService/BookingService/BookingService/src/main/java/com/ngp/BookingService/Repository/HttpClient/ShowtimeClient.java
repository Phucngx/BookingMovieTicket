package com.ngp.BookingService.Repository.HttpClient;

import com.ngp.BookingService.DTO.Request.HoldRequest;
import com.ngp.BookingService.DTO.Request.ReserveRequest;
import com.ngp.BookingService.DTO.Response.*;
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

    @GetMapping(value = "/internal/get-movie-by-showtime/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<MovieBriefResponse> getMovieDetailByShowtimeId(@PathVariable Long id);

    @GetMapping(value = "/internal/get-theater-by-showtime/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<TheaterResponse> getTheaterDetailByShowtimeId(@PathVariable Long id);

    @GetMapping(value = "/internal/get-room-by-showtime/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<RoomBriefResponse> getRoomDetailByShowtimeId(@PathVariable Long id);

}
