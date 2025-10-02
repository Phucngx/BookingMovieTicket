package com.ngp.TheaterService.Controller;

import com.ngp.TheaterService.DTO.Request.TheaterRequest;
import com.ngp.TheaterService.DTO.Response.ApiResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Service.Theater.TheaterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/theaters")
public class TheaterController {
    TheaterService theaterService;

    @PostMapping("/create")
    public ApiResponse<TheaterResponse> createTheater(@RequestBody TheaterRequest request) {
        return ApiResponse.<TheaterResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.createTheater(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<TheaterResponse> updateTheater(@PathVariable Long id, @RequestBody TheaterRequest request) {
        return ApiResponse.<TheaterResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.updateTheater(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteTheater(@PathVariable Long id) {
        theaterService.deleteTheater(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Theater deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<TheaterResponse>> getAllTheater(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<TheaterResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.getAllTheater(page, size))
                .build();
    }

    @GetMapping("/get-detail/{id}")
    public ApiResponse<TheaterResponse> getDetailTheater(@PathVariable Long id) {
        return ApiResponse.<TheaterResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.getDetailTheater(id))
                .build();
    }

    @GetMapping("/get-theaters")
    public ApiResponse<List<TheaterResponse>> getTheatersByCity(@RequestParam(name = "city") String city) {
        return ApiResponse.<List<TheaterResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.getTheatersByCity(city))
                .build();
    }

    @GetMapping("/internal/get-theater-by-room/{id}")
    public ApiResponse<TheaterResponse> getTheaterByRoomId(@PathVariable Long id) {
        return ApiResponse.<TheaterResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(theaterService.getTheaterByRoomId(id))
                .build();
    }

}
