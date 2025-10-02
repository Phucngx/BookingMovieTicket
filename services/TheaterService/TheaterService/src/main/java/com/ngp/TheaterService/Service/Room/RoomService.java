package com.ngp.TheaterService.Service.Room;

import com.ngp.TheaterService.DTO.Request.RoomRequest;
import com.ngp.TheaterService.DTO.Response.RoomBriefResponse;
import com.ngp.TheaterService.DTO.Response.RoomResponse;
import com.ngp.TheaterService.Entity.RoomEntity;
import com.ngp.TheaterService.Entity.TheaterEntity;
import com.ngp.TheaterService.Exception.AppException;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Mapper.RoomMapper;
import com.ngp.TheaterService.Repository.RoomRepository;
import com.ngp.TheaterService.Repository.TheaterRepository;
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
public class RoomService implements IRoomService{
    RoomRepository roomRepository;
    RoomMapper roomMapper;
    TheaterRepository theaterRepository;

    @Override
    public RoomResponse createRoom(RoomRequest request) {
        if(roomRepository.existsByRoomName(request.getRoomName())){
            throw new AppException(ErrorCode.ROOM_EXISTS);
        }
        RoomEntity room = roomMapper.toRoom(request);
        TheaterEntity theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        room.setTheater(theater);
        room.setTotalSeats(0);

        int totalRoomsInTheater = theater.getTotalRooms();
        theater.setTotalRooms(totalRoomsInTheater + 1);
        theaterRepository.save(theater);

        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomMapper.updateRoom(room, request);

        TheaterEntity theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        room.setTheater(theater);

        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    @Override
    public void deleteRoom(Long id) {
        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        TheaterEntity theater = room.getTheater();
        int totalRoomsInTheater = theater.getTotalRooms();
        theater.setTotalRooms(totalRoomsInTheater - 1);
        theaterRepository.save(theater);
        roomRepository.deleteById(id);
    }

    @Override
    public Page<RoomResponse> getAllRooms(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<RoomEntity> listRooms = roomRepository.findAll(pageable);
        if (listRooms.isEmpty()) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
        return listRooms.map(roomMapper::toRoomResponse);
    }

    @Override
    public RoomResponse getDetailRoom(Long id) {
        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return roomMapper.toRoomResponse(room);
    }

    @Override
    public List<RoomResponse> getRoomsByTheaterId(Long theaterId) {
        TheaterEntity theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        List<RoomEntity> rooms = roomRepository.findByTheater(theater);
        if (rooms.isEmpty()) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
        return rooms.stream().map(roomMapper::toRoomResponse).toList();
    }

    @Override
    public RoomBriefResponse getRoomBrief(Long id) {
        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return RoomBriefResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .theaterId(room.getTheater().getTheaterId())
                .totalSeats(room.getTotalSeats())
                .build();
    }

    @Override
    public List<RoomBriefResponse> getAllRoomByTheaterID(Long theaterId) {
        TheaterEntity theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        List<RoomEntity> rooms = roomRepository.findByTheater(theater);
        if (rooms.isEmpty()) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
        return rooms.stream().map(roomMapper::toRoomBriefResponse).toList();
    }
}
