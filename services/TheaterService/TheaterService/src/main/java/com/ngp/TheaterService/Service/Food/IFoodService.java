package com.ngp.TheaterService.Service.Food;

import com.ngp.TheaterService.Contrains.FoodType;
import com.ngp.TheaterService.DTO.Request.FoodRequest;
import com.ngp.TheaterService.DTO.Response.FoodBriefResponse;
import com.ngp.TheaterService.DTO.Response.FoodResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IFoodService {
    FoodResponse createFood(FoodRequest request);
    FoodResponse updateFood(Long id, FoodRequest request);
    void deleteFood(Long id);
    Page<FoodResponse> getAllFoods(int page, int size);
    FoodResponse getDetailFood(Long id);
    List<FoodResponse> getFoodsByFoodType(FoodType foodType);
    FoodBriefResponse getDetailBriefFood(Long id);
}
