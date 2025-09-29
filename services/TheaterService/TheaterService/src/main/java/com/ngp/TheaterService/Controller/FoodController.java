package com.ngp.TheaterService.Controller;

import com.ngp.TheaterService.Contrains.FoodType;
import com.ngp.TheaterService.DTO.Request.FoodRequest;
import com.ngp.TheaterService.DTO.Response.ApiResponse;
import com.ngp.TheaterService.DTO.Response.FoodBriefResponse;
import com.ngp.TheaterService.DTO.Response.FoodResponse;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Service.Food.FoodService;
import com.ngp.TheaterService.Service.Room.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/foods")
public class FoodController {
    FoodService foodService;

    @PostMapping("/create")
    public ApiResponse<FoodResponse> createFood(@RequestBody FoodRequest request) {
        return ApiResponse.<FoodResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.createFood(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<FoodResponse> updateFood(@PathVariable Long id, @RequestBody FoodRequest request) {
        return ApiResponse.<FoodResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.updateFood(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Food deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<FoodResponse>> getAllFoods(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<FoodResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.getAllFoods(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<FoodResponse> getDetailFood(@PathVariable Long id) {
        return ApiResponse.<FoodResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.getDetailFood(id))
                .build();
    }

    @GetMapping("/get-type")
    public ApiResponse<List<FoodResponse>> getFoodByType(@RequestParam("type") FoodType foodType) {
        return ApiResponse.<List<FoodResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.getFoodsByFoodType(foodType))
                .build();
    }

    @GetMapping("/internal/get-details/{id}")
    public ApiResponse<FoodBriefResponse> getDetailBriefFood(@PathVariable Long id) {
        return ApiResponse.<FoodBriefResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(foodService.getDetailBriefFood(id))
                .build();
    }
}
