package com.ngp.TheaterService.Mapper;

import com.ngp.TheaterService.DTO.Request.RoomRequest;
import com.ngp.TheaterService.DTO.Response.RoomBriefResponse;
import com.ngp.TheaterService.DTO.Response.RoomResponse;
import com.ngp.TheaterService.Entity.RoomEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoomMapper {
    @Mapping(target = "theater", ignore = true)
    RoomEntity toRoom(RoomRequest request);

    RoomResponse toRoomResponse(RoomEntity room);

    @Mapping(target = "theater", ignore = true)
    void updateRoom(@MappingTarget RoomEntity room, RoomRequest request);

    RoomBriefResponse toRoomBriefResponse(RoomEntity room);
}
