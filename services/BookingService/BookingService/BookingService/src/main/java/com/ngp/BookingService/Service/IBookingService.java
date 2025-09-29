package com.ngp.BookingService.Service;

import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Request.PaymentCallbackRequest;
import com.ngp.BookingService.DTO.Response.BookingConfirmResponse;
import com.ngp.BookingService.DTO.Response.BookingDetailResponse;
import com.ngp.BookingService.DTO.Response.BookingResponse;
import com.ngp.BookingService.DTO.Response.TicketResponse;
import org.springframework.data.domain.Page;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest request);
    BookingConfirmResponse confirmBooking(Long bookingId);
    void cancelBooking(Long bookingId);
    Page<BookingResponse> getAllBookings(int page, int size);
    BookingDetailResponse handlePaymentCallback(PaymentCallbackRequest request);
    TicketResponse getTicketByBookingId(Long bookingId);
}
