package com.ngp.TheaterService.Service.Seat;

import com.ngp.TheaterService.DTO.Response.SeatResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISeatService {
    List<SeatResponse> getAllSeat();
    List<SeatResponse> getSeatByRoomId(Long roomId);
}
