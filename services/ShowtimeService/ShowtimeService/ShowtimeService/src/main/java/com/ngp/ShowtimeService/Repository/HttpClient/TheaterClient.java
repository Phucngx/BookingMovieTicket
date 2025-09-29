package com.ngp.ShowtimeService.Repository.HttpClient;

import com.ngp.ShowtimeService.DTO.Response.ApiResponse;
import com.ngp.ShowtimeService.DTO.Response.MovieBriefResponse;
import com.ngp.ShowtimeService.DTO.Response.MovieLiteResponse;
import com.ngp.ShowtimeService.DTO.Response.TheaterResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "theater-service", url = "http://localhost:8083/theater-service/theaters"
//        , configuration = {
//            AuthenticationRequestInterceptor.class
//        }
)
public interface TheaterClient {
    @GetMapping(value = "/internal/get-theater-by-room/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<TheaterResponse> getTheaterByRoom(@PathVariable Long id);

}
