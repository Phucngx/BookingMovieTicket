package com.ngp.TheaterService.Service.Theater;

import com.ngp.TheaterService.DTO.Request.TheaterRequest;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Entity.TheaterEntity;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ITheaterService {
    TheaterResponse createTheater(TheaterRequest request);
    TheaterResponse updateTheater(Long id, TheaterRequest request);
    void deleteTheater(Long id);
    Page<TheaterResponse> getAllTheater(int page, int size);
    TheaterResponse getDetailTheater(Long id);
    List<TheaterResponse> getTheatersByCity(String city);
    TheaterResponse getTheaterByRoomId(Long id);
}
