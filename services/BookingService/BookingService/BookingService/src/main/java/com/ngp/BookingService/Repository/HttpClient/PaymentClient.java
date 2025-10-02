package com.ngp.BookingService.Repository.HttpClient;

import com.ngp.BookingService.DTO.Response.ApiResponse;
import com.ngp.BookingService.DTO.Response.PaymentOrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "payment-service", url = "http://localhost:8086/payment-service/payments")
public interface PaymentClient {

    @PostMapping("/create-order")
    PaymentOrderResponse createOrder(@RequestBody Map<String, Object> request);
}
