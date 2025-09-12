package com.ngp.ShowtimeService.Service.Showtime;

import com.ngp.ShowtimeService.DTO.MovieShowtimesDTO;
import com.ngp.ShowtimeService.DTO.Request.ShowtimeRequest;
import com.ngp.ShowtimeService.DTO.Response.ShowSeatsResponse;
import com.ngp.ShowtimeService.DTO.Response.ShowtimeResponse;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IShowtimeService {
    ShowtimeResponse createShowtime(ShowtimeRequest request);
    ShowtimeResponse updateShowtime(Long showtimeId, ShowtimeRequest request);
    void deleteShowtime(Long showtimeId);
    ShowtimeResponse getDetailShowtime(Long showtimeId);
    Page<ShowtimeResponse> getAllShowtimes(int page, int size);
    List<ShowtimeResponse> getShowtimesByMovieId(Long movieId);
    List<ShowtimeResponse> getShowtimes(Long movieId, Long theaterId, LocalDateTime startOfDay, LocalDateTime endOfDay);
    List<MovieShowtimesDTO> getShowtimesByTheaterAndDate(Long theaterId, LocalDate date);
    ShowSeatsResponse getSeatsByShowtime(Long showtimeId);
}
