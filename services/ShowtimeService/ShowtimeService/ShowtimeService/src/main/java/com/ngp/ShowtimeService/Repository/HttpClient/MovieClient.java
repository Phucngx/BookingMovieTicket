package com.ngp.ShowtimeService.Repository.HttpClient;

import com.ngp.ShowtimeService.Configuration.AuthenticationRequestInterceptor;
import com.ngp.ShowtimeService.DTO.Response.ApiResponse;
import com.ngp.ShowtimeService.DTO.Response.MovieBriefResponse;
import com.ngp.ShowtimeService.DTO.Response.MovieLiteResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@FeignClient(name = "movie-service", url = "http://localhost:8082/movie-service/movies"
//        , configuration = {
//            AuthenticationRequestInterceptor.class
//        }
)
public interface MovieClient {
    @GetMapping(value = "/internal/get-movie/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<MovieBriefResponse> getMovie(@PathVariable Long id);

    @PostMapping(value = "/internal/get-movie-lites", produces = MediaType.APPLICATION_JSON_VALUE)
    List<MovieLiteResponse> getMovieLites(List<Long> movieIds);
}
