package com.ngp.BookingService.Service;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.DTO.Request.BookingRequest;
import com.ngp.BookingService.DTO.Request.HoldRequest;
import com.ngp.BookingService.DTO.Request.ReserveRequest;
import com.ngp.BookingService.DTO.Response.BookingResponse;
import com.ngp.BookingService.DTO.Response.HoldResult;
import com.ngp.BookingService.DTO.Response.ReserveResult;
import com.ngp.BookingService.DTO.Response.ShowtimeResponse;
import com.ngp.BookingService.Entity.BookingEntity;
import com.ngp.BookingService.Entity.BookingSeatEntity;
import com.ngp.BookingService.Entity.TicketEntity;
import com.ngp.BookingService.Exception.AppException;
import com.ngp.BookingService.Exception.ErrorCode;
import com.ngp.BookingService.Repository.BookingRepository;
import com.ngp.BookingService.Repository.BookingSeatRepository;
import com.ngp.BookingService.Repository.HttpClient.ShowtimeClient;
import com.ngp.BookingService.Repository.TicketRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BookingService implements IBookingService{
    BookingRepository bookingRepository;
    BookingSeatRepository bookingSeatRepository;
    TicketRepository ticketRepository;
    ShowtimeClient showtimeClient;

    @Override
    public BookingResponse createBooking(BookingRequest request) {
        ShowtimeResponse showtime = showtimeClient.getShowtimeDetail(request.getShowtimeId()).getData();
        Double totalPrice = showtime.getPrice() * request.getSeatIds().size();
        // Set booking
        BookingEntity booking = BookingEntity.builder()
                .accountId(request.getAccountId())
                .showtimeId(request.getShowtimeId())
                .totalPrice(totalPrice)
                .status(StatusType.PENDING)
                .build();

        HoldRequest holdRequest = HoldRequest.builder()
                .showtimeId(request.getShowtimeId())
                .seatIds(request.getSeatIds())
                .ttlSeconds(300)
                .build();

        HoldResult holdResult = showtimeClient.holdSeat(holdRequest).getData();
        String holedId = holdResult.getHoldId();
        // Save booking
        booking = bookingRepository.save(booking);

        //  Logic payment -> Hiện tại pass qua bước này

        ReserveRequest reserveRequest = ReserveRequest.builder()
                .holdId(holedId)
                .bookingId(booking.getBookingId())
                .build();

        ReserveResult reserveResult = showtimeClient.reserveSeat(reserveRequest).getData();
        booking.setStatus(StatusType.CONFIRMED);
        booking = bookingRepository.save(booking);

        // Save booking seat
        for (Long seatId : request.getSeatIds()) {
            BookingSeatEntity bookingSeat = BookingSeatEntity.builder()
                    .booking(booking)
                    .seatId(seatId)
                    .build();
            bookingSeatRepository.save(bookingSeat);
        }

        // Save ticket
        TicketEntity ticket = TicketEntity.builder()
                .booking(booking)
                .status("Released")
                .qrCode("QR")
                .build();
        ticket = ticketRepository.save(ticket);

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .accountId(booking.getAccountId())
                .showtimeId(booking.getShowtimeId())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .ticketId(ticket.getTicketId())
                .build();
    }

    @Override
    public Page<BookingResponse> getAllBookings(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<BookingEntity> bookingPage = bookingRepository.findAll(pageable);
        if (bookingPage.isEmpty()) {
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }
        return bookingPage.map(booking -> BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .accountId(booking.getAccountId())
                .showtimeId(booking.getShowtimeId())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .build());
    }
}
