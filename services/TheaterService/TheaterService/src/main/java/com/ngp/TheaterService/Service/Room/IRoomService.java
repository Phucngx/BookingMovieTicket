package com.ngp.TheaterService.Service.Room;

import com.ngp.TheaterService.DTO.Request.RoomRequest;
import com.ngp.TheaterService.DTO.Request.TheaterRequest;
import com.ngp.TheaterService.DTO.Response.RoomBriefResponse;
import com.ngp.TheaterService.DTO.Response.RoomResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Mapper.RoomMapper;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRoomService {
    RoomResponse createRoom(RoomRequest request);
    RoomResponse updateRoom(Long id, RoomRequest request);
    void deleteRoom(Long id);
    Page<RoomResponse> getAllRooms(int page, int size);
    RoomResponse getDetailRoom(Long id);
    List<RoomResponse> getRoomsByTheaterId(Long theaterId);
    RoomBriefResponse getRoomBrief(Long id);
    List<RoomBriefResponse> getAllRoomByTheaterID(Long theaterId);
}
