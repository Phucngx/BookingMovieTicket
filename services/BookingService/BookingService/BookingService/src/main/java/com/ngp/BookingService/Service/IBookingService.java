package com.ngp.BookingService.Service;

import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Response.BookingResponse;
import org.springframework.data.domain.Page;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest request);
    Page<BookingResponse> getAllBookings(int page, int size);
}
