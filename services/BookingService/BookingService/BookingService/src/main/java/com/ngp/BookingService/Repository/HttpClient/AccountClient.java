package com.ngp.BookingService.Repository.HttpClient;

import com.ngp.BookingService.DTO.Response.AccountDetailsResponse;
import com.ngp.BookingService.DTO.Response.ApiResponse;
import com.ngp.BookingService.DTO.Response.HoldResult;
import com.ngp.BookingService.DTO.Response.PaymentOrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "account-service", url = "http://localhost:8081/user-service/accounts"
//        , configuration = {
//            AuthenticationRequestInterceptor.class
//        }
)
public interface AccountClient {

    @GetMapping("internal/get-detail-account/{accountId}")
    ApiResponse<AccountDetailsResponse> getAccountDetails(@PathVariable Long accountId);

}
