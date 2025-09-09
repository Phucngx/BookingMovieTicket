//package com.ngp.UserService.Repository.HttpClient;
//
//import com.ngp.UserService.Configuration.AuthenticationRequestInterceptor;
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.http.MediaType;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.util.List;
//
//@FeignClient(name = "movie-service", url = "http://localhost:8082/api/v1/movies",
//        configuration = {
//            AuthenticationRequestInterceptor.class
//        })
//public interface ProfileClient {
//    @GetMapping(value = "/get-all", produces = MediaType.APPLICATION_JSON_VALUE)
//    List<Object> getAllMovies(
//            @RequestParam(name = "page") int page,
//            @RequestParam(name = "size") int size);
//}
