package com.ngp.TheaterService.Service.Seat;

import com.ngp.TheaterService.DTO.Response.SeatResponse;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.DTO.RoomSeatDTO;
import com.ngp.TheaterService.Entity.RoomEntity;
import com.ngp.TheaterService.Entity.SeatEntity;
import com.ngp.TheaterService.Entity.TheaterEntity;
import com.ngp.TheaterService.Exception.AppException;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Mapper.SeatMapper;
import com.ngp.TheaterService.Repository.RoomRepository;
import com.ngp.TheaterService.Repository.SeatRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class SeatService implements ISeatService{
    SeatRepository seatRepository;
    RoomRepository roomRepository;
    SeatMapper seatMapper;

    @Override
    public List<SeatResponse> getAllSeat() {
        List<SeatEntity> listSeat = seatRepository.findAll();
        return listSeat.stream().map(seatMapper::toSeatResponse).toList();
    }

    @Override
    public List<SeatResponse> getSeatByRoomId(Long roomId) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        List<SeatEntity> listSeats = seatRepository.findByRoom(room);
        if(listSeats.isEmpty()){
            throw new AppException(ErrorCode.SEAT_NOT_FOUND);
        }
        return listSeats.stream().map(seatMapper::toSeatResponse).toList();
    }

    @Override
    public List<RoomSeatDTO> getSeats(Long roomId) {
        List<RoomSeatDTO> result = new ArrayList<>();
        List<SeatEntity> list = seatRepository.findByRoom_RoomIdOrderBySeatRowAscSeatNumberAsc(roomId);
        if (list == null) return result;

        for (SeatEntity s : list) {
            RoomSeatDTO dto = new RoomSeatDTO();
            dto.setSeatId(s.getSeatId());
            dto.setSeatRow(s.getSeatRow());
            dto.setSeatNumber(s.getSeatNumber());
            dto.setSeatType(s.getSeatType() != null ? s.getSeatType().name() : null);
            result.add(dto);
        }
        return result;
    }
}
