package com.ngp.TheaterService.Controller;

import com.ngp.TheaterService.DTO.Response.ApiResponse;
import com.ngp.TheaterService.DTO.Response.SeatResponse;
import com.ngp.TheaterService.DTO.RoomSeatDTO;
import com.ngp.TheaterService.Entity.SeatEntity;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Service.Seat.SeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/seats")
public class SeatController {
    SeatService seatService;

    @GetMapping("/get-all")
    public ApiResponse<List<SeatResponse>> getAllSeat() {
        return ApiResponse.<List<SeatResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(seatService.getAllSeat())
                .build();
    }

    @GetMapping("/get-seats/{id}")
    public ApiResponse<List<SeatResponse>> getSeatByRoom(@PathVariable Long id) {
        return ApiResponse.<List<SeatResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(seatService.getSeatByRoomId(id))
                .build();
    }

    @GetMapping("internal/get-seats-by-room/{roomId}")
    public ApiResponse<List<RoomSeatDTO>> getSeats(@PathVariable Long roomId) {
        return ApiResponse.<List<RoomSeatDTO>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(seatService.getSeats(roomId))
                .build();
    }

}
