package com.ngp.TheaterService.Service.Food;

import com.ngp.TheaterService.Contrains.FoodType;
import com.ngp.TheaterService.DTO.Request.FoodRequest;
import com.ngp.TheaterService.DTO.Response.FoodResponse;
import com.ngp.TheaterService.Entity.FoodEntity;
import com.ngp.TheaterService.Exception.AppException;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Mapper.FoodMapper;
import com.ngp.TheaterService.Repository.FoodRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FoodService implements IFoodService{
    FoodRepository foodRepository;
    FoodMapper foodMapper;

    @Override
    public FoodResponse createFood(FoodRequest request) {
        if(foodRepository.existsByFoodName(request.getFoodName())){
            throw new AppException(ErrorCode.FOOD_EXISTS);
        }
        FoodEntity food = foodMapper.toFood(request);
        return foodMapper.toFoodResponse(foodRepository.save(food));
    }

    @Override
    public FoodResponse updateFood(Long id, FoodRequest request) {
        FoodEntity food = foodRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
        foodMapper.updateFood(food, request);
        return foodMapper.toFoodResponse(foodRepository.save(food));
    }

    @Override
    public void deleteFood(Long id) {
        FoodEntity food = foodRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
        foodRepository.delete(food);
    }

    @Override
    public Page<FoodResponse> getAllFoods(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<FoodEntity> foodPage = foodRepository.findAll(pageable);
        return foodPage.map(foodMapper::toFoodResponse);
    }

    @Override
    public FoodResponse getDetailFood(Long id) {
        FoodEntity food = foodRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
        return foodMapper.toFoodResponse(food);
    }

    @Override
    public List<FoodResponse> getFoodsByFoodType(FoodType foodType) {
        List<FoodEntity> foods = foodRepository.findByFoodType(foodType);
        return foods.stream().map(foodMapper::toFoodResponse).toList();
    }
}
