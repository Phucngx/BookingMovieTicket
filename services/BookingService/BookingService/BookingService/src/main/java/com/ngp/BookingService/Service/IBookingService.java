package com.ngp.BookingService.Service;

import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Request.PaymentCallbackRequest;
import com.ngp.BookingService.DTO.Response.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest request);
    BookingConfirmResponse confirmBooking(Long bookingId);
    void cancelBooking(Long bookingId);
    Page<BookingFullResponse> getAllBookings(int page, int size);
    BookingDetailResponse handlePaymentCallback(PaymentCallbackRequest request);
    TicketResponse getTicketByBookingId(Long bookingId);
    Page<TicketResponse> getTicketsByAccountId(Long accountId, String period, int page, int size);
    RevenueResponse getRevenueReport(String period);
}
