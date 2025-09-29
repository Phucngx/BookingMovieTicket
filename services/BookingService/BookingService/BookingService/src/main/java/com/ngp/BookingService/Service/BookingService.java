package com.ngp.BookingService.Service;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.DTO.Request.*;
import com.ngp.BookingService.DTO.Response.*;
import com.ngp.BookingService.Entity.BookingEntity;
import com.ngp.BookingService.Entity.BookingFoodEntity;
import com.ngp.BookingService.Entity.BookingSeatEntity;
import com.ngp.BookingService.Entity.TicketEntity;
import com.ngp.BookingService.Exception.AppException;
import com.ngp.BookingService.Exception.ErrorCode;
import com.ngp.BookingService.Repository.BookingFoodRepository;
import com.ngp.BookingService.Repository.BookingRepository;
import com.ngp.BookingService.Repository.BookingSeatRepository;
import com.ngp.BookingService.Repository.HttpClient.PaymentClient;
import com.ngp.BookingService.Repository.HttpClient.ShowtimeClient;
import com.ngp.BookingService.Repository.HttpClient.TheaterClient;
import com.ngp.BookingService.Repository.TicketRepository;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BookingService implements IBookingService{
    BookingRepository bookingRepository;
    BookingSeatRepository bookingSeatRepository;
    BookingFoodRepository bookingFoodRepository;
    TicketRepository ticketRepository;
    ShowtimeClient showtimeClient;
    PaymentClient paymentClient;
    TheaterClient theaterClient;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // 1) Lấy giá từ Showtime
        ShowtimeResponse showtime = showtimeClient
                .getShowtimeDetail(request.getShowtimeId())
                .getData();
        int unit = showtime.getPrice().intValue();
        int foodTotal = 0;

        List<FoodBriefResponse> foods = new ArrayList<>();
        for (Long foodId : request.getFoodIds()) {
            FoodBriefResponse food = theaterClient.getFoodDetail(foodId).getData();
            foods.add(food);
        }
        for (FoodBriefResponse food : foods) {
            foodTotal += food.getPrice();
        }

        int amount = (unit * request.getSeatIds().size()) + foodTotal;

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

        for (Long foodId : request.getFoodIds()) {
            bookingFoodRepository.save(
                    BookingFoodEntity.builder()
                            .booking(booking)
                            .foodId(foodId)
                            .status(StatusType.PENDING)
                            .build()
            );
        }

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

        // 1) Reserve ghế ở Showtime
        ReserveRequest reserveReq = ReserveRequest.builder()
                .holdId(booking.getHoldId())
                .bookingId(booking.getBookingId())
                .build();
        ReserveResult reserveRes = showtimeClient.reserveSeat(reserveReq).getData();

        // 2)Thanh toán OK -> cập nhật trạng thái
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
    public BookingDetailResponse handlePaymentCallback(PaymentCallbackRequest req) {
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

            // 3. Lưu seat, food mapping
            for (Long seatId : reserveRes.getReservedSeatIds()) {
                bookingSeatRepository.save(
                        BookingSeatEntity.builder()
                                .booking(booking)
                                .seatId(seatId)
                                .build()
                );
            }

            for (BookingFoodEntity bf : bookingFoodRepository.findByBooking(booking)) {
                bf.setStatus(StatusType.CONFIRMED);
                bookingFoodRepository.save(bf);
            }

            // 4. ticket
            TicketEntity ticket = ticketRepository.save(
                    TicketEntity.builder()
                            .booking(booking)
                            .status("Released")
                            .qrCode("/dist/assets/frame.png")
                            .build()
            );
        } else {
            log.info("Payment for booking {} failed, cancelling booking", booking.getBookingId());
            cancelBooking(booking.getBookingId());
            bookingRepository.save(booking);
        }
        return BookingDetailResponse.builder()
                .bookingId(booking.getBookingId())
                .accountId(booking.getAccountId())
                .showtimeId(booking.getShowtimeId())
                .status(booking.getStatus().name())
                .totalPrice(booking.getTotalPrice())
                .paymentId(booking.getPaymentId())
                .build();
    }

    @Override
    public TicketResponse getTicketByBookingId(Long bookingId) {
        TicketEntity ticket = ticketRepository.findByBooking_BookingId(bookingId);
        if (ticket == null){
            throw new AppException(ErrorCode.TICKET_NOT_FOUND);
        }
        BookingEntity booking = ticket.getBooking();

        List<BookingSeatEntity> bookingSeats = bookingSeatRepository.findByBooking_BookingId(booking.getBookingId());
        List<String> seatNames = bookingSeats.stream()
                .map(seat -> {
                    SeatBriefResponse seatRes = theaterClient.getSeatDetail(seat.getSeatId()).getData();
                    return seatRes.getSeatRow() + String.format("%02d", seatRes.getSeatNumber());
                })
                .toList();

        List<BookingFoodEntity> bookingFoods = bookingFoodRepository.findByBooking_BookingId(booking.getBookingId());
        List<String> foodNames = bookingFoods.stream()
                .map(food -> theaterClient.getFoodDetail(food.getFoodId()).getData().getFoodName())
                .toList();

        MovieBriefResponse movie = showtimeClient.getMovieDetailByShowtimeId(booking.getShowtimeId()).getData();
        log.info("Movie: {}", movie);
        ShowtimeResponse showtime = showtimeClient.getShowtimeDetail(booking.getShowtimeId()).getData();
        log.info("showtime: {}", showtime);
        TheaterResponse theater = showtimeClient.getTheaterDetailByShowtimeId(booking.getShowtimeId()).getData();
        log.info("theater: {}", theater);
        RoomBriefResponse room = showtimeClient.getRoomDetailByShowtimeId(booking.getShowtimeId()).getData();
        log.info("room: {}", room);

        return TicketResponse.builder()
                .bookingId(booking.getBookingId())
                .seatNames(seatNames)
                .foodNames(foodNames)
                .createdAt(ticket.getCreatedAt())
                .qrCode(ticket.getQrCode())
                .movieName(movie.getTitle())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .theaterName(theater.getTheaterName())
                .roomName(room.getRoomName())
                .build();
    }

}
