package com.ngp.BookingService.Service;

import com.ngp.BookingService.DTO.Request.BookingConfirmRequest;
import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Request.PaymentCallbackRequest;
import com.ngp.BookingService.DTO.Response.BookingConfirmResponse;
import com.ngp.BookingService.DTO.Response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest request);

    BookingConfirmResponse confirmBooking(Long bookingId);

    void cancelBooking(Long bookingId);

    Page<BookingResponse> getAllBookings(int page, int size);

    void handlePaymentCallback(PaymentCallbackRequest request);
}
