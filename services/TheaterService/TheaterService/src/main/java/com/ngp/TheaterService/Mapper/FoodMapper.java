package com.ngp.TheaterService.Mapper;

import com.ngp.TheaterService.DTO.Request.FoodRequest;
import com.ngp.TheaterService.DTO.Response.FoodResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Entity.FoodEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FoodMapper {
    FoodEntity toFood(FoodRequest request);
    FoodResponse toFoodResponse(FoodEntity food);
    void updateFood(@MappingTarget FoodEntity food, FoodRequest request);
}
