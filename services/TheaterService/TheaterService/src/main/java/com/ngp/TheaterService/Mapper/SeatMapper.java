package com.ngp.TheaterService.Mapper;

import com.ngp.TheaterService.DTO.Request.RoomRequest;
import com.ngp.TheaterService.DTO.Request.SeatRequest;
import com.ngp.TheaterService.DTO.Response.RoomResponse;
import com.ngp.TheaterService.DTO.Response.SeatResponse;
import com.ngp.TheaterService.Entity.RoomEntity;
import com.ngp.TheaterService.Entity.SeatEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SeatMapper {
    @Mapping(target = "room", ignore = true)
    SeatEntity toSeat(SeatRequest request);

    @Mapping(target = "room", ignore = true)
    void updateSeat(@MappingTarget SeatEntity room, SeatRequest request);

    SeatResponse toSeatResponse(SeatEntity room);
}
