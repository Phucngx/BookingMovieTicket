package com.ngp.ShowtimeService.Service.Showtime;

import com.ngp.ShowtimeService.Constrains.SeatStatus;
import com.ngp.ShowtimeService.DTO.MovieShowtimesDTO;
import com.ngp.ShowtimeService.DTO.Request.ShowtimeRequest;
import com.ngp.ShowtimeService.DTO.Response.*;
import com.ngp.ShowtimeService.DTO.RoomSeatDTO;
import com.ngp.ShowtimeService.DTO.ShowtimeItemDTO;
import com.ngp.ShowtimeService.Entity.LockSeatEntity;
import com.ngp.ShowtimeService.Entity.ShowtimeEntity;
import com.ngp.ShowtimeService.Exception.AppException;
import com.ngp.ShowtimeService.Exception.ErrorCode;
import com.ngp.ShowtimeService.Mapper.ShowtimeMapper;
import com.ngp.ShowtimeService.Repository.HttpClient.MovieClient;
import com.ngp.ShowtimeService.Repository.HttpClient.RoomClient;
import com.ngp.ShowtimeService.Repository.HttpClient.SeatClient;
import com.ngp.ShowtimeService.Repository.HttpClient.TheaterClient;
import com.ngp.ShowtimeService.Repository.LockSeatRepository.LockSeatRepository;
import com.ngp.ShowtimeService.Repository.ShowtimeRepository.ShowtimeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.redisson.api.RKeys;
import org.redisson.api.RedissonClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ShowtimeService implements IShowtimeService{
    ShowtimeRepository showtimeRepository;
    ShowtimeMapper showtimeMapper;
    MovieClient movieClient;
    RoomClient roomClient;
    SeatClient seatClient;
    TheaterClient theaterClient;
    RedissonClient redisson;
    LockSeatRepository lockSeatRepository;

    @Override
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        Long movieId = request.getMovieId();
        Long roomId = request.getRoomId();
        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();
        if(showtimeRepository.existsShowtime(movieId, roomId, startTime, endTime)){
            throw new AppException(ErrorCode.SHOWTIME_EXISTS);
        }
        MovieBriefResponse movie = movieClient.getMovie(movieId).getData();
        RoomBriefResponse room = roomClient.getRoom(roomId).getData();
        ShowtimeEntity showtime = showtimeMapper.toShowtime(request);
        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }

    @Override
    public ShowtimeResponse updateShowtime(Long showtimeId, ShowtimeRequest request) {
        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        if(request.getRoomId() != null){
            Long roomId = request.getRoomId();
            roomClient.getRoom(roomId);
        }
        if(request.getMovieId() != null){
            Long movieId = request.getMovieId();
            movieClient.getMovie(movieId);
        }
        showtimeMapper.updateShowtime(showtime, request);
        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }

    @Override
    public void deleteShowtime(Long showtimeId) {
        if(!showtimeRepository.existsById(showtimeId)){
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }
        showtimeRepository.deleteById(showtimeId);
    }

    @Override
    public ShowtimeResponse getDetailShowtime(Long showtimeId) {
        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        return showtimeMapper.toShowtimeResponse(showtime);
    }

    @Override
    public Page<ShowtimeResponse> getAllShowtimes(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<ShowtimeEntity> showtimePage = showtimeRepository.findAll(pageable);
        if (showtimePage.isEmpty()) {
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }
        return showtimePage.map(showtimeMapper::toShowtimeResponse);
    }

    @Override
    public List<ShowtimeResponse> getShowtimesByMovieId(Long movieId) {
        MovieBriefResponse movie = movieClient.getMovie(movieId).getData();
        List<ShowtimeEntity> showtimes = showtimeRepository.findByMovieId(movieId);
        if(showtimes.isEmpty()){
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }
        return showtimes.stream().map(showtimeMapper::toShowtimeResponse).toList();
    }

    @Override
    public List<ShowtimeResponse> getShowtimes(Long movieId, Long theaterId, LocalDateTime startOfDay, LocalDateTime endOfDay) {
        MovieBriefResponse movie = movieClient.getMovie(movieId).getData();
        List<RoomBriefResponse> rooms = roomClient.getAllRoomByTheaterId(theaterId).getData();

        List<Long> roomIds = rooms.stream().map(RoomBriefResponse::getRoomId).toList();
        List<ShowtimeEntity> showtimes = showtimeRepository.findShowtimes(movieId, roomIds, startOfDay, endOfDay);
        if(showtimes.isEmpty()){
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }
        return showtimes.stream()
                .sorted(Comparator.comparing(ShowtimeEntity::getStartTime))
                .map(showtimeMapper::toShowtimeResponse)
                .toList();
    }

    @Override
    public List<MovieShowtimesDTO> getShowtimesByTheaterAndDate(Long theaterId, LocalDate date) {
        List<MovieShowtimesDTO> result = new ArrayList<>();

        // 1. Get Room IDs by theaterId
        List<RoomBriefResponse> roomBriefResponses = roomClient.getAllRoomByTheaterId(theaterId).getData();
        List<Long> roomIds = roomBriefResponses.stream().map(RoomBriefResponse::getRoomId).toList();

        // 2) Tính khoảng thời gian của 1 ngày [start, end)
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end   = date.plusDays(1).atStartOfDay();

        // 3) Lấy danh sách suất chiếu trong ngày cho các roomIds
        List<ShowtimeEntity> stList = showtimeRepository.findByRoomIdsAndDate(roomIds, start, end);
        if (stList == null || stList.isEmpty()) {
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }

        // 4) Lấy danh sách movieId (không trùng)
        List<Long> movieIds = new ArrayList<>();
        for (ShowtimeEntity st : stList) {
            Long mid = st.getMovieId();
            if (mid != null && !movieIds.contains(mid)) {
                movieIds.add(mid);
            }
        }

        // 5) Gọi MovieService để lấy thông tin phim (batch)
        List<MovieLiteResponse> movieList = movieClient.getMovieLites(movieIds);

        // 6) Đưa về map movieId -> MovieLiteResponse cho dễ tra cứu
        Map<Long, MovieLiteResponse> movieMap = new HashMap<>();
        if (movieList != null) {
            for (MovieLiteResponse mv : movieList) {
                movieMap.put(mv.getId(), mv);
            }
        }

        // 7) Gom nhóm suất chiếu theo movieId
        DateTimeFormatter tf = DateTimeFormatter.ofPattern("HH:mm");
        Map<Long, MovieShowtimesDTO> grouped = new LinkedHashMap<>(); // giữ thứ tự chèn

        for (ShowtimeEntity st : stList) {
            Long mid = st.getMovieId();
            MovieLiteResponse mv = movieMap.get(mid);
            if (mv == null) {
                continue; // không có thông tin phim thì bỏ qua
            }

            // Lấy block theo movieId; nếu chưa có thì tạo mới
            MovieShowtimesDTO block = grouped.get(mid);
            if (block == null) {
                block = new MovieShowtimesDTO();
                block.setMovie(mv);
                block.setShowtimes(new ArrayList<ShowtimeItemDTO>());
                grouped.put(mid, block);
            }

            // Thêm 1 showtime vào block
            ShowtimeItemDTO item = new ShowtimeItemDTO();
            item.setId(st.getShowtimeId());
            item.setTime(st.getStartTime().toLocalTime().format(tf));
            item.setPrice(st.getPrice());
            item.setRoomId(st.getRoomId());
            block.getShowtimes().add(item);
        }

        // 8) Sắp xếp các giờ chiếu trong từng block theo thời gian tăng dần
        for (MovieShowtimesDTO block : grouped.values()) {
            List<ShowtimeItemDTO> items = block.getShowtimes();
            items.sort(new Comparator<ShowtimeItemDTO>() {
                @Override
                public int compare(ShowtimeItemDTO o1, ShowtimeItemDTO o2) {
                    // Vì định dạng "HH:mm" nên có thể so sánh chuỗi,
                    // nhưng parse sang LocalTime cho chắc chắn.
                    LocalTime t1 = LocalTime.parse(o1.getTime(), tf);
                    LocalTime t2 = LocalTime.parse(o2.getTime(), tf);
                    return t1.compareTo(t2);
                }
            });
        }

        // 9) Chuyển Map -> List để trả về (giữ thứ tự chèn)
        for (Map.Entry<Long, MovieShowtimesDTO> entry : grouped.entrySet()) {
            result.add(entry.getValue());
        }

        return result;
    }

    @Override
    public ShowSeatsResponse getSeatsByShowtime(Long showtimeId) {
        ShowSeatsResponse response = new ShowSeatsResponse();

        // 1) showtime -> roomId, price
        ShowtimeEntity st = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        Long roomId = st.getRoomId();
        Double price = st.getPrice();

        // 2) seats của phòng
        List<RoomSeatDTO> roomSeats = seatClient.getSeatsByRoom(roomId).getData();
        if (roomSeats == null) roomSeats = new ArrayList<>();

        // 3) tập ghế HOLD & BOOKED từ Redis
        Set<Long> holdSet = findSeatIdsByPattern("seat:hold:" + showtimeId + ":*");
        Set<Long> reservedSet = new HashSet<>();
        List<LockSeatEntity> lockSeatEntity = lockSeatRepository.findByIdShowtimeId(showtimeId);
        if(lockSeatEntity != null && !lockSeatEntity.isEmpty()){
            for(LockSeatEntity lockSeat : lockSeatEntity){
                reservedSet.add(lockSeat.getId().getSeatId());
            }
        }

        // 4) map sang SeatView
        List<SeatViewResponse> views = new ArrayList<>();
        int maxRowIdx = -1;
        int maxColIdx = -1;

        for (RoomSeatDTO s : roomSeats) {
            SeatViewResponse v = new SeatViewResponse();
            v.setSeatId(s.getSeatId());
            v.setSeatRow(s.getSeatRow());
            v.setSeatNumber(s.getSeatNumber());
            v.setSeatType(s.getSeatType());
            v.setPrice(price);

            // code, rowIndex, colIndex
            String code = buildSeatCode(s.getSeatRow(), s.getSeatNumber());
            v.setCode(code);

            Integer ri = calcRowIndex(s.getSeatRow());
            Integer ci = (s.getSeatNumber() != null) ? s.getSeatNumber() - 1 : null;
            v.setRowIndex(ri);
            v.setColIndex(ci);

            if (ri != null && ri > maxRowIdx) maxRowIdx = ri;
            if (ci != null && ci > maxColIdx) maxColIdx = ci;

            // status
            Long sid = s.getSeatId();
            if (sid != null && reservedSet.contains(sid)) {
                v.setStatus(SeatStatus.BOOKED);
            } else if (sid != null && holdSet.contains(sid)) {
                v.setStatus(SeatStatus.HOLD);
            } else {
                v.setStatus(SeatStatus.AVAILABLE);
            }

            views.add(v);
        }

        // 5) layout
        SeatLayout layout = new SeatLayout();
        layout.setRoomId(roomId);
        layout.setRows(maxRowIdx >= 0 ? maxRowIdx + 1 : null);
        layout.setCols(maxColIdx >= 0 ? maxColIdx + 1 : null);


        response.setLayout(layout);
        response.setSeats(views);
        return response;
    }

    @Override
    public MovieBriefResponse getMovieBriefShowtime(Long showtimeId) {
        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        MovieBriefResponse movieBriefResponse = movieClient.getMovie(showtime.getMovieId()).getData();
        if(movieBriefResponse == null){
            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
        }
        return movieBriefResponse;
    }

    @Override
    public TheaterResponse getTheaterByShowtime(Long showtimeId) {
        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        TheaterResponse theater = theaterClient.getTheaterByRoom(showtime.getRoomId()).getData();
        if(theater == null){
            throw new AppException(ErrorCode.THEATER_NOT_FOUND);
        }
        return theater;
    }

    @Override
    public RoomBriefResponse getRoomByShowtime(Long showtimeId) {
        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        RoomBriefResponse room = roomClient.getRoom(showtime.getRoomId()).getData();
        if(room == null){
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
        return room;
    }

    private Set<Long> findSeatIdsByPattern(String pattern) {
        Set<Long> result = new HashSet<>();
        RKeys keys = redisson.getKeys();
        Iterable<String> it = keys.getKeysByPattern(pattern);
        if (it == null) return result;

        for (String k : it) {
            int lastColon = k.lastIndexOf(':');
            if (lastColon > -1 && lastColon + 1 < k.length()) {
                String seatIdStr = k.substring(lastColon + 1);
                try {
                    Long sid = Long.parseLong(seatIdStr);
                    result.add(sid);
                } catch (NumberFormatException ignored) {}
            }
        }
        return result;
    }

    // "A" + 1 -> "A01" (zero pad 2 chữ số; chỉnh width nếu muốn)
    private String buildSeatCode(Character seatRow, Integer seatNumber) {
        if (seatRow == null || seatNumber == null) return null;
        String num = (seatNumber < 10) ? ("0" + seatNumber) : String.valueOf(seatNumber);
        return String.valueOf(seatRow) + num;
    }

    // 'A' -> 0, 'B' -> 1, ...
    private Integer calcRowIndex(Character seatRow) {
        if (seatRow == null) return null;
        char c = Character.toUpperCase(seatRow);
        if (c < 'A' || c > 'Z') return null;
        return c - 'A';
    }

}
