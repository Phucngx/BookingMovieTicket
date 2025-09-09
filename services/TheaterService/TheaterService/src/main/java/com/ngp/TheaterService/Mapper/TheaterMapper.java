package com.ngp.TheaterService.Mapper;

import com.ngp.TheaterService.DTO.Request.TheaterRequest;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Entity.TheaterEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TheaterMapper {
    TheaterEntity toTheater(TheaterRequest request);
    TheaterResponse toTheaterResponse(TheaterEntity theater);
    void updateTheater(@MappingTarget TheaterEntity theater, TheaterRequest request);
}
