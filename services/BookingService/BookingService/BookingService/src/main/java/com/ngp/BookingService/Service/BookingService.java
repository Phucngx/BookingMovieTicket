package com.ngp.BookingService.Service;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.DTO.Request.*;
import com.ngp.BookingService.DTO.Response.*;
import com.ngp.BookingService.Entity.BookingEntity;
import com.ngp.BookingService.Entity.BookingSeatEntity;
import com.ngp.BookingService.Entity.TicketEntity;
import com.ngp.BookingService.Exception.AppException;
import com.ngp.BookingService.Exception.ErrorCode;
import com.ngp.BookingService.Repository.BookingRepository;
import com.ngp.BookingService.Repository.BookingSeatRepository;
import com.ngp.BookingService.Repository.HttpClient.PaymentClient;
import com.ngp.BookingService.Repository.HttpClient.ShowtimeClient;
import com.ngp.BookingService.Repository.TicketRepository;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BookingService implements IBookingService{
    BookingRepository bookingRepository;
    BookingSeatRepository bookingSeatRepository;
    TicketRepository ticketRepository;
    ShowtimeClient showtimeClient;
    PaymentClient paymentClient;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // 1) Lấy giá từ Showtime
        ShowtimeResponse showtime = showtimeClient
                .getShowtimeDetail(request.getShowtimeId())
                .getData();
        int unit = showtime.getPrice().intValue();
        int amount = unit * request.getSeatIds().size();

        // 2) Gọi HOLD
        int ttlSeconds = 60 * 15; // 15 phút
        HoldRequest holdReq = HoldRequest.builder()
                .showtimeId(request.getShowtimeId())
                .seatIds(request.getSeatIds())
                .ttlSeconds(ttlSeconds)
                .build();
        HoldResult holdRes = showtimeClient.holdSeat(holdReq).getData();

        // 3) Lưu booking PENDING + holdId
        BookingEntity booking = BookingEntity.builder()
                .accountId(request.getAccountId())
                .showtimeId(request.getShowtimeId())
                .totalPrice((double) amount)
                .status(StatusType.PENDING)
                .holdId(holdRes.getHoldId())
                .holdExpiresAt(holdRes.getExpiresAt())
                .build();
        booking = bookingRepository.save(booking);

        Map<String, Object> paymentReq = Map.of(
                "bookingId", booking.getBookingId(),
                "amount", booking.getTotalPrice().intValue(),
                "accountId", booking.getAccountId(),
                "provider", "ZALOPAY"
        );

        PaymentOrderResponse paymentOrder = paymentClient.createOrder(paymentReq);
        booking.setPaymentId(paymentOrder.getPaymentId());
        bookingRepository.save(booking);

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus().name())
                .amount(amount)
                .holdId(booking.getHoldId())
                .holdExpiresAt(booking.getHoldExpiresAt())
                .qrUrl(paymentOrder.getQrUrl())
                .build();
    }

    @Override
    @Transactional
    public BookingConfirmResponse confirmBooking(Long bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!StatusType.PENDING.equals(booking.getStatus())) {
            throw new AppException(ErrorCode.BOOKING_INVALID_STATE);
        }

        // 1) Reserve ghế ở Showtime (atomic)
        ReserveRequest reserveReq = ReserveRequest.builder()
                .holdId(booking.getHoldId())
                .bookingId(booking.getBookingId())
                .build();
        ReserveResult reserveRes = showtimeClient.reserveSeat(reserveReq).getData();

        // 2) (Giả lập) thanh toán OK -> cập nhật trạng thái
        booking.setStatus(StatusType.CONFIRMED);
        bookingRepository.save(booking);

        // 3) LƯU BOOKING_SEAT tại đây

        for (Long seatId : reserveRes.getReservedSeatIds()) {
            bookingSeatRepository.save(
                    BookingSeatEntity.builder()
                            .booking(booking)
                            .seatId(seatId)
                            .build()
            );
        }

        TicketEntity ticket = ticketRepository.save(
                TicketEntity.builder()
                        .booking(booking)
                        .status("Released")
                        .qrCode("QR" + booking.getBookingId())
                        .build()
        );
        ticketRepository.save(ticket);

        return BookingConfirmResponse.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus().name())
                .seatIds(reserveRes.getReservedSeatIds())
                .ticketId(ticket.getTicketId())
                .build();
    }

    @Override
    public void cancelBooking(Long bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        String holdId = booking.getHoldId();
        showtimeClient.cancelSeatHold(holdId);

        booking.setStatus(StatusType.CANCELLED);
        bookingRepository.save(booking);
    }


    @Override
    public Page<BookingResponse> getAllBookings(int page, int size) {
//        Sort sort = Sort.by("createdAt").descending();
//        Pageable pageable = PageRequest.of(page - 1, size, sort);
//        Page<BookingEntity> bookingPage = bookingRepository.findAll(pageable);
//        if (bookingPage.isEmpty()) {
//            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
//        }
//        return bookingPage.map(booking -> BookingResponse.builder()
//                .bookingId(booking.getBookingId())
//                .ho(booking.getShowtimeId())
//                .status(booking.getStatus())
//                .totalPrice(booking.getTotalPrice())
//                .build());
        return null;
    }

    @Override
    @Transactional
    public void handlePaymentCallback(PaymentCallbackRequest req) {
        BookingEntity booking = bookingRepository.findByPaymentId(req.getPaymentId());
        if (booking == null) {
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }

        if (!StatusType.PENDING.equals(booking.getStatus())) {
            throw new AppException(ErrorCode.BOOKING_INVALID_STATE);
        }

        if ("SUCCESS".equals(req.getStatus())) {
            // 1. Reserve ghế
            ReserveRequest reserveReq = ReserveRequest.builder()
                    .holdId(booking.getHoldId())
                    .bookingId(booking.getBookingId())
                    .build();
            ReserveResult reserveRes = showtimeClient.reserveSeat(reserveReq).getData();

            // 2. Update booking
            booking.setStatus(StatusType.CONFIRMED);
            bookingRepository.save(booking);

            // 3. Lưu seat mapping
            for (Long seatId : reserveRes.getReservedSeatIds()) {
                bookingSeatRepository.save(
                        BookingSeatEntity.builder()
                                .booking(booking)
                                .seatId(seatId)
                                .build()
                );
            }

            // 4. Sinh ticket
            TicketEntity ticket = ticketRepository.save(
                    TicketEntity.builder()
                            .booking(booking)
                            .status("Released")
                            .qrCode("QR" + booking.getBookingId())
                            .build()
            );
        } else {
            cancelBooking(booking.getBookingId());
            bookingRepository.save(booking);
        }
    }

}
