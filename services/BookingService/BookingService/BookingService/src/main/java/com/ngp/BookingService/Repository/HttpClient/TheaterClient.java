package com.ngp.BookingService.Repository.HttpClient;

import com.ngp.BookingService.DTO.Response.ApiResponse;
import com.ngp.BookingService.DTO.Response.FoodBriefResponse;
import com.ngp.BookingService.DTO.Response.PaymentOrderResponse;
import com.ngp.BookingService.DTO.Response.SeatBriefResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "theater-service", url = "http://localhost:8083/theater-service")
public interface TheaterClient {
    @GetMapping("/seats/internal/get-details/{id}")
    ApiResponse<SeatBriefResponse> getSeatDetail(@PathVariable Long id);

    @GetMapping("/foods/internal/get-details/{id}")
    ApiResponse<FoodBriefResponse> getFoodDetail(@PathVariable Long id);
}
