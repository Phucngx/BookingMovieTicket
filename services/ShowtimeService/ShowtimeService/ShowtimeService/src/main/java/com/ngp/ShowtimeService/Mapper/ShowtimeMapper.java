package com.ngp.ShowtimeService.Mapper;

import com.ngp.ShowtimeService.DTO.Request.ShowtimeRequest;
import com.ngp.ShowtimeService.DTO.Response.ShowtimeResponse;
import com.ngp.ShowtimeService.Entity.ShowtimeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ShowtimeMapper {
    ShowtimeEntity toShowtime(ShowtimeRequest request);
    ShowtimeResponse toShowtimeResponse(ShowtimeEntity showtime);
    void updateShowtime(@MappingTarget ShowtimeEntity showtime, ShowtimeRequest request);
}
