package com.ngp.ShowtimeService.Controller;

import com.ngp.ShowtimeService.DTO.MovieShowtimesDTO;
import com.ngp.ShowtimeService.DTO.Request.ReserveRequest;
import com.ngp.ShowtimeService.DTO.Response.*;
import com.ngp.ShowtimeService.DTO.Request.HoldRequest;
import com.ngp.ShowtimeService.DTO.Request.ShowtimeRequest;
import com.ngp.ShowtimeService.Exception.ErrorCode;
import com.ngp.ShowtimeService.Repository.LockSeatRepository.LockSeatRepository;
import com.ngp.ShowtimeService.Service.SeatHoldService.SeatHoldService;
import com.ngp.ShowtimeService.Service.SeatReservationService.SeatReservationService;
import com.ngp.ShowtimeService.Service.Showtime.ShowtimeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.redisson.api.RedissonClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/showtimes")
public class ShowtimeController {
    ShowtimeService showtimeService;
    LockSeatRepository lockSeatRepository;
    RedissonClient redissonClient;
    SeatHoldService seatHoldService;
    SeatReservationService seatReservationService;

    @PostMapping("/create")
    public ApiResponse<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        return ApiResponse.<ShowtimeResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.createShowtime(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<ShowtimeResponse> updateShowtime(@PathVariable Long id, @RequestBody ShowtimeRequest request) {
        return ApiResponse.<ShowtimeResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.updateShowtime(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Showtime deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<ShowtimeResponse>> getAllShowtimes(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<ShowtimeResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.getAllShowtimes(page, size))
                .build();
    }

    @GetMapping("/get-detail/{id}")
    public ApiResponse<ShowtimeResponse> getDetailShowtime(@PathVariable Long id) {
        return ApiResponse.<ShowtimeResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.getDetailShowtime(id))
                .build();
    }

    @GetMapping("/get-showtimes/theaters/{theaterId}/movies/{movieId}")
    public ApiResponse<List<ShowtimeResponse>> getAllShowtimes(
            @PathVariable Long movieId,
            @PathVariable Long theaterId,
            @RequestParam LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endExclusive = date.plusDays(1).atStartOfDay();
        return ApiResponse.<List<ShowtimeResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.getShowtimes(movieId, theaterId, startOfDay, endExclusive))
                .build();
    }

    //Truyền showtimeId, trả về list seatId đã được hold và reserved
    @GetMapping("/taken-seats/{id}")
    public ApiResponse<Map<String, List<Long>>> taken(@PathVariable Long id) {
        List<Long> reserved = lockSeatRepository.findReservedSeatIds(id);
        // list holds by pattern scan – demo (sản xuất dùng set tracking hold)
        var pattern = "seat:hold:%d:*".formatted(id);
        List<Long> holds = redissonClient.getKeys().getKeysStreamByPattern(pattern)
                .map(k -> Long.parseLong(k.substring(k.lastIndexOf(":")+1))).toList();
        return ApiResponse.<Map<String, List<Long>>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(Map.of("holdSeatIds", holds, "reservedSeatIds", reserved))
                .build();
    }

    @PostMapping("/internal/seat-holds")
    public ApiResponse<HoldResult> holdSeat(@RequestBody HoldRequest req){
        return ApiResponse.<HoldResult>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(seatHoldService.createHold(req.getShowtimeId(),
                        req.getSeatIds(),
                        req.getTtlSeconds()==null?300:req.getTtlSeconds()))
                .build();
    }

    //Truyền holdId, hủy hold, trả về 204 No Content
    @DeleteMapping("/internal/seat-holds/cancel/{holdId}")
    public ApiResponse<String> deleteHoldSeat(@PathVariable String holdId){
        seatHoldService.cancelHold(holdId);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Hold seat cancelled successfully")
                .build();
    }

    @PostMapping("/internal/seat-reservations")
    public ApiResponse<ReserveResult> reserveSeat(@RequestBody ReserveRequest req){
        return ApiResponse.<ReserveResult>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(seatReservationService.reserveFromHold(req.getHoldId(), req.getBookingId()))
                .build();
    }

    @GetMapping("/get-showtimes-by-date/{theaterId}")
    public ApiResponse<List<MovieShowtimesDTO>> getShowtimeByDate(
            @PathVariable Long theaterId,
            @RequestParam LocalDate date
    ) {
        return ApiResponse.<List<MovieShowtimesDTO>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(showtimeService.getShowtimesByTheaterAndDate(theaterId, date))
                .build();
    }

    @GetMapping("get-seats/{showtimeId}")
    public ApiResponse<ShowSeatsResponse> getSeats(@PathVariable Long showtimeId) {
        ShowSeatsResponse data = showtimeService.getSeatsByShowtime(showtimeId);
        return ApiResponse.<ShowSeatsResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(data)
                .build();
    }

}
