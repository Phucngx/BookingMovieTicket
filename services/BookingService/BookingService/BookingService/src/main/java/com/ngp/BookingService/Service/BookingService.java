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
import com.ngp.BookingService.Repository.HttpClient.AccountClient;
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
import org.springframework.data.domain.*;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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
    AccountClient accountClient;

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
    public Page<BookingFullResponse> getAllBookings(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<BookingEntity> bookingsPage = bookingRepository.findAll(pageable);

        if (bookingsPage.isEmpty()) {
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }

        // Tạo thread pool cố định (ví dụ 10 thread, bạn điều chỉnh tùy nhu cầu)
        ExecutorService executor = Executors.newFixedThreadPool(10);

        List<BookingFullResponse> bookingFullResponses = bookingsPage.stream().map(booking -> {
            try {
                // Lấy danh sách seat và food cho booking
                List<BookingSeatEntity> bookingSeats = bookingSeatRepository.findByBooking_BookingId(booking.getBookingId());
                List<BookingFoodEntity> bookingFoods = bookingFoodRepository.findByBooking_BookingId(booking.getBookingId());

                // Gọi song song API lấy seat details
                CompletableFuture<List<String>> seatNamesFuture = CompletableFuture.supplyAsync(() -> {
                    return bookingSeats.stream()
                            .map(seat -> {
                                SeatBriefResponse seatRes = theaterClient.getSeatDetail(seat.getSeatId()).getData();
                                return seatRes.getSeatRow() + String.format("%02d", seatRes.getSeatNumber());
                            })
                            .toList();
                }, executor);

                // Gọi song song API lấy food names
                CompletableFuture<List<String>> foodNamesFuture = CompletableFuture.supplyAsync(() -> {
                    return bookingFoods.stream()
                            .map(food -> theaterClient.getFoodDetail(food.getFoodId()).getData().getFoodName())
                            .toList();
                }, executor);

                // Các API lấy movie, showtime, theater, room, account
                CompletableFuture<MovieBriefResponse> movieFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getMovieDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<ShowtimeResponse> showtimeFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getShowtimeDetail(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<TheaterResponse> theaterFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getTheaterDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<RoomBriefResponse> roomFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getRoomDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<AccountDetailsResponse> accountFuture = CompletableFuture.supplyAsync(() -> {
                    return accountClient.getAccountDetails(booking.getAccountId()).getData();
                }, executor);

                // Chờ tất cả các futures hoàn thành
                CompletableFuture.allOf(
                        seatNamesFuture,
                        foodNamesFuture,
                        movieFuture,
                        showtimeFuture,
                        theaterFuture,
                        roomFuture,
                        accountFuture
                ).join();

                // Lấy kết quả từ futures
                List<String> seatNames = seatNamesFuture.get();
                List<String> foodNames = foodNamesFuture.get();
                MovieBriefResponse movie = movieFuture.get();
                ShowtimeResponse showtime = showtimeFuture.get();
                TheaterResponse theater = theaterFuture.get();
                RoomBriefResponse room = roomFuture.get();
                AccountDetailsResponse account = accountFuture.get();

                // Tạo BookingFullResponse
                return BookingFullResponse.builder()
                        .bookingId(booking.getBookingId())
                        .userName(account.getUsername())
                        .status(StatusType.valueOf(booking.getStatus().name()))
                        .totalPrice(booking.getTotalPrice())
                        .createdAt(booking.getCreatedAt())
                        .seatNames(seatNames)
                        .foodNames(foodNames)
                        .movieName(movie.getTitle())
                        .startTime(showtime.getStartTime())
                        .endTime(showtime.getEndTime())
                        .theaterName(theater.getTheaterName())
                        .roomName(room.getRoomName())
                        .build();

            } catch (InterruptedException | ExecutionException e) {
                // Log lỗi và có thể ném ra ngoại lệ hoặc xử lý tùy trường hợp
                throw new RuntimeException("Error fetching booking details asynchronously", e);
            }
        }).toList();

        executor.shutdown();

        return new PageImpl<>(bookingFullResponses, pageable, bookingsPage.getTotalElements());
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

    @Override
    public Page<TicketResponse> getTicketsByAccountId(Long accountId, String period, int page, int size) {
        LocalDateTime start = null;
        LocalDateTime end = null;

        switch (period) {
            case "today":
                start = LocalDate.now().atStartOfDay();
                end = LocalDate.now().atTime(23,59,59);
                break;
            case "month":
                start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                end = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23,59,59);
                break;
            case "year":
                start = LocalDate.now().withDayOfYear(1).atStartOfDay();
                end = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear()).atTime(23,59,59);
                break;
            default: // all
                break;
        }

        List<BookingEntity> bookings;
        if (start != null) {
            bookings = bookingRepository.findByAccountIdAndCreatedAtBetween(accountId, start, end);
        } else {
            bookings = bookingRepository.findByAccountId(accountId);
        }

        if (bookings.isEmpty()){
            throw new AppException(ErrorCode.BOOKING_NOT_FOUND);
        }
        List<TicketResponse> tickets = new ArrayList<>();

        ExecutorService executor = Executors.newFixedThreadPool(10);

        for (BookingEntity booking : bookings) {
            try {
                TicketEntity ticket = ticketRepository.findByBooking_BookingId(booking.getBookingId());
                if (ticket == null) continue;

                List<BookingSeatEntity> bookingSeats = bookingSeatRepository.findByBooking_BookingId(booking.getBookingId());
                List<BookingFoodEntity> bookingFoods = bookingFoodRepository.findByBooking_BookingId(booking.getBookingId());

                // Gọi song song API lấy seat details
                CompletableFuture<List<String>> seatNamesFuture = CompletableFuture.supplyAsync(() -> {
                    return bookingSeats.stream()
                            .map(seat -> {
                                SeatBriefResponse seatRes = theaterClient.getSeatDetail(seat.getSeatId()).getData();
                                return seatRes.getSeatRow() + String.format("%02d", seatRes.getSeatNumber());
                            })
                            .toList();
                }, executor);

                // Gọi song song API lấy food names
                CompletableFuture<List<String>> foodNamesFuture = CompletableFuture.supplyAsync(() -> {
                    return bookingFoods.stream()
                            .map(food -> theaterClient.getFoodDetail(food.getFoodId()).getData().getFoodName())
                            .toList();
                }, executor);

                // Các API lấy movie, showtime, theater, room, account
                CompletableFuture<MovieBriefResponse> movieFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getMovieDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<ShowtimeResponse> showtimeFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getShowtimeDetail(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<TheaterResponse> theaterFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getTheaterDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                CompletableFuture<RoomBriefResponse> roomFuture = CompletableFuture.supplyAsync(() -> {
                    return showtimeClient.getRoomDetailByShowtimeId(booking.getShowtimeId()).getData();
                }, executor);

                // Chờ tất cả các futures hoàn thành
                CompletableFuture.allOf(
                        seatNamesFuture,
                        foodNamesFuture,
                        movieFuture,
                        showtimeFuture,
                        theaterFuture,
                        roomFuture
                ).join();

                // Lấy kết quả từ futures
                List<String> seatNames = seatNamesFuture.get();
                List<String> foodNames = foodNamesFuture.get();
                MovieBriefResponse movie = movieFuture.get();
                ShowtimeResponse showtime = showtimeFuture.get();
                TheaterResponse theater = theaterFuture.get();
                RoomBriefResponse room = roomFuture.get();

                tickets.add(TicketResponse.builder()
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
                        .build());
            } catch (InterruptedException | ExecutionException e) {
                // Log lỗi và có thể ném ra ngoại lệ hoặc xử lý tùy trường hợp
                throw new RuntimeException("Error fetching ticket details asynchronously", e);
            }
        }

        executor.shutdown();

        tickets.sort((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()));

        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        return PageableExecutionUtils.getPage(
                tickets,
                pageable,
                () -> tickets.size()
        );
    }

    @Override
    public RevenueResponse getRevenueReport(String period) {
        String p = period.toLowerCase();
        LocalDateTime now = LocalDateTime.now();

        switch (p) {
            case "today" -> {
                LocalDate today = now.toLocalDate();
                LocalDateTime start = today.atStartOfDay();
                LocalDateTime end = start.plusDays(1);

                var rows = bookingRepository.findCreatedAtAndAmountBetween(StatusType.CONFIRMED, start, end);
                // group theo giờ 0..23
                double[] byHour = new double[24];
                for (Object[] r : rows) {
                    LocalDateTime ts = (LocalDateTime) r[0];
                    Double amount = (Double) r[1];
                    int h = ts.getHour();
                    byHour[h] += (amount == null ? 0d : amount);
                }
                List<String> labels = new ArrayList<>();
                List<Double> data = new ArrayList<>();
                for (int h = 0; h < 24; h++) {
                    labels.add(String.format("%02d", h));
                    data.add(byHour[h]);
                }
                Double total = bookingRepository.sumAmountBetween(StatusType.CONFIRMED, start, end);
                return RevenueResponse.of("today", labels, data, total, start, end);
            }

            case "week" -> {
                // ISO: Thứ 2 đầu tuần
                LocalDate monday = now.toLocalDate().with(java.time.DayOfWeek.MONDAY);
                LocalDateTime start = monday.atStartOfDay();
                LocalDateTime end = start.plusDays(7);

                var rows = bookingRepository.findCreatedAtAndAmountBetween(StatusType.CONFIRMED, start, end);
                Map<LocalDate, Double> sumByDay = new HashMap<>();
                for (Object[] r : rows) {
                    LocalDate d = ((LocalDateTime) r[0]).toLocalDate();
                    Double amount = (Double) r[1];
                    sumByDay.merge(d, amount == null ? 0d : amount, Double::sum);
                }
                List<String> labels = new ArrayList<>();
                List<Double> data = new ArrayList<>();
                for (int i = 0; i < 7; i++) {
                    LocalDate d = monday.plusDays(i);
                    labels.add(d.toString());
                    data.add(sumByDay.getOrDefault(d, 0d));
                }
                Double total = bookingRepository.sumAmountBetween(StatusType.CONFIRMED, start, end);
                return RevenueResponse.of("week", labels, data, total, start, end);
            }

            case "month" -> {
                LocalDate first = now.toLocalDate().withDayOfMonth(1);
                int len = first.lengthOfMonth();
                LocalDateTime start = first.atStartOfDay();
                LocalDateTime end = start.plusMonths(1);

                var rows = bookingRepository.findCreatedAtAndAmountBetween(StatusType.CONFIRMED, start, end);
                Map<Integer, Double> sumByDayNo = new HashMap<>();
                for (Object[] r : rows) {
                    LocalDateTime ts = (LocalDateTime) r[0];
                    Double amount = (Double) r[1];
                    int day = ts.getDayOfMonth();
                    sumByDayNo.merge(day, amount == null ? 0d : amount, Double::sum);
                }
                List<String> labels = new ArrayList<>();
                List<Double> data = new ArrayList<>();
                for (int d = 1; d <= len; d++) {
                    labels.add(first.withDayOfMonth(d).toString());
                    data.add(sumByDayNo.getOrDefault(d, 0d));
                }
                Double total = bookingRepository.sumAmountBetween(StatusType.CONFIRMED, start, end);
                return RevenueResponse.of("month", labels, data, total, start, end);
            }

            case "year" -> {
                int y = now.getYear();
                LocalDate jan1 = LocalDate.of(y, 1, 1);
                LocalDateTime start = jan1.atStartOfDay();
                LocalDateTime end = start.plusYears(1);

                var rows = bookingRepository.findCreatedAtAndAmountBetween(StatusType.CONFIRMED, start, end);
                Map<Integer, Double> sumByMonth = new HashMap<>();
                for (Object[] r : rows) {
                    LocalDateTime ts = (LocalDateTime) r[0];
                    Double amount = (Double) r[1];
                    int m = ts.getMonthValue();
                    sumByMonth.merge(m, amount == null ? 0d : amount, Double::sum);
                }
                List<String> labels = new ArrayList<>();
                List<Double> data = new ArrayList<>();
                for (int m = 1; m <= 12; m++) {
                    labels.add(String.format("%04d-%02d", y, m));
                    data.add(sumByMonth.getOrDefault(m, 0d));
                }
                Double total = bookingRepository.sumAmountBetween(StatusType.CONFIRMED, start, end);
                return RevenueResponse.of("year", labels, data, total, start, end);
            }

            default -> throw new IllegalArgumentException("period phải là today|week|month|year");
        }
    }
}
