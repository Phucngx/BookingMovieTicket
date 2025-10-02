package com.ngp.ShowtimeService.Repository.HttpClient;

import com.ngp.ShowtimeService.DTO.Response.ApiResponse;
import com.ngp.ShowtimeService.DTO.Response.RoomBriefResponse;
import com.ngp.ShowtimeService.DTO.RoomSeatDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "seat-service", url = "http://localhost:8083/theater-service/seats"
//        , configuration = {
//                AuthenticationRequestInterceptor.class
//        }
)
public interface SeatClient {
    @GetMapping("internal/get-seats-by-room/{roomId}")
    ApiResponse<List<RoomSeatDTO>> getSeatsByRoom(@PathVariable Long roomId);
}
