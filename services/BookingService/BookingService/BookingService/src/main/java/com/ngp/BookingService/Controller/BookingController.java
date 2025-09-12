package com.ngp.BookingService.Controller;

import com.ngp.BookingService.DTO.Request.BookingConfirmRequest;
import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Request.PaymentCallbackRequest;
import com.ngp.BookingService.DTO.Response.ApiResponse;
import com.ngp.BookingService.DTO.Response.BookingConfirmResponse;
import com.ngp.BookingService.DTO.Response.BookingResponse;
import com.ngp.BookingService.Exception.ErrorCode;
import com.ngp.BookingService.Service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/bookings")
public class BookingController {
    BookingService bookingService;

    @PostMapping("/create")
    ApiResponse<BookingResponse> createBooking(@RequestBody BookingRequest request){
        return ApiResponse.<BookingResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(bookingService.createBooking(request))
                .build();
    }

    @PostMapping("/confirm/{id}")
    public ApiResponse<BookingConfirmResponse> confirmBooking(
            @PathVariable Long id) {
        return ApiResponse.<BookingConfirmResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(bookingService.confirmBooking(id))
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<BookingResponse>> getAllBookings(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<BookingResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(bookingService.getAllBookings(page, size))
                .build();
    }

    @DeleteMapping("/cancel/{id}")
    public ApiResponse<String> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data("Booking cancelled successfully")
                .build();
    }

    @PostMapping("/payment-callback")
    public ApiResponse<Void> paymentCallback(@RequestBody PaymentCallbackRequest request) {
        bookingService.handlePaymentCallback(request);
        return ApiResponse.<Void>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Payment callback processed")
                .build();
    }
}
