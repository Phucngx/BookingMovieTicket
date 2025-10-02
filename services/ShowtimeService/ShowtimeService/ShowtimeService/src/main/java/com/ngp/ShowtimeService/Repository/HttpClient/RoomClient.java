package com.ngp.ShowtimeService.Repository.HttpClient;

import com.ngp.ShowtimeService.Configuration.AuthenticationRequestInterceptor;
import com.ngp.ShowtimeService.DTO.Response.ApiResponse;
import com.ngp.ShowtimeService.DTO.Response.RoomBriefResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "room-service", url = "http://localhost:8083/theater-service/rooms"
//        , configuration = {
//                AuthenticationRequestInterceptor.class
//        }
)
public interface RoomClient {
    @GetMapping(value = "/internal/get-room/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<RoomBriefResponse> getRoom(@PathVariable Long id);

    @GetMapping(value = "/internal/get-rooms/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<RoomBriefResponse>> getAllRoomByTheaterId(@PathVariable Long id);

}
