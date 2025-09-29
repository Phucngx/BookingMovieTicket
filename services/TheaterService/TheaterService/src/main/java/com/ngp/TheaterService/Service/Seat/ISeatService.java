package com.ngp.TheaterService.Service.Seat;

import com.ngp.TheaterService.DTO.Response.SeatBriefResponse;
import com.ngp.TheaterService.DTO.Response.SeatResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.DTO.RoomSeatDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISeatService {
    List<SeatResponse> getAllSeat();
    List<SeatResponse> getSeatByRoomId(Long roomId);
    List<RoomSeatDTO> getSeats(Long roomId);
    SeatBriefResponse getDetailBriefSeat(Long id);
}
