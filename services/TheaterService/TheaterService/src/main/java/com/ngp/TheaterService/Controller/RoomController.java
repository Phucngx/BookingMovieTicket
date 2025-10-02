package com.ngp.TheaterService.Controller;

import com.ngp.TheaterService.DTO.Request.RoomRequest;
import com.ngp.TheaterService.DTO.Response.ApiResponse;
import com.ngp.TheaterService.DTO.Response.RoomBriefResponse;
import com.ngp.TheaterService.DTO.Response.RoomResponse;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Service.Room.RoomService;
import com.ngp.TheaterService.Service.Theater.TheaterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {
    RoomService roomService;

    @PostMapping("/create")
    public ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.createRoom(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<RoomResponse> updateRoom(@PathVariable Long id, @RequestBody RoomRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.updateRoom(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Room deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<RoomResponse>> getAllRooms(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<RoomResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.getAllRooms(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<RoomResponse> getDetailRoom(@PathVariable Long id) {
        return ApiResponse.<RoomResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.getDetailRoom(id))
                .build();
    }

//    @GetMapping("/get-rooms/{id}")
//    public ApiResponse<List<RoomResponse>> getRoomInTheater(@PathVariable Long id) {
//        return ApiResponse.<List<RoomResponse>>builder()
//                .code(ErrorCode.SUCCESS.getCode())
//                .data(roomService.getRoomsByTheaterId(id))
//                .build();
//    }

    @GetMapping("/internal/get-room/{id}")
    public ApiResponse<RoomBriefResponse> getRoomBrief(@PathVariable Long id) {
        return ApiResponse.<RoomBriefResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.getRoomBrief(id))
                .build();
    }

    @GetMapping("/internal/get-rooms/{id}")
    public ApiResponse<List<RoomBriefResponse>> getRoomInTheater(@PathVariable Long id) {
        return ApiResponse.<List<RoomBriefResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roomService.getAllRoomByTheaterID(id))
                .build();
    }
}
