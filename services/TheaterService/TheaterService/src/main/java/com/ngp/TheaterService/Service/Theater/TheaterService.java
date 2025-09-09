package com.ngp.TheaterService.Service.Theater;

import com.ngp.TheaterService.DTO.Request.TheaterRequest;
import com.ngp.TheaterService.DTO.Response.TheaterResponse;
import com.ngp.TheaterService.Entity.TheaterEntity;
import com.ngp.TheaterService.Exception.AppException;
import com.ngp.TheaterService.Exception.ErrorCode;
import com.ngp.TheaterService.Mapper.TheaterMapper;
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
public class TheaterService implements ITheaterService{
    TheaterRepository theaterRepository;
    TheaterMapper theaterMapper;

    @Override
    public TheaterResponse createTheater(TheaterRequest request) {
        if(theaterRepository.existsByTheaterName(request.getTheaterName())){
            throw new AppException(ErrorCode.THEATER_EXISTS);
        }
        TheaterEntity theater = theaterMapper.toTheater(request);
        theater.setTotalRooms(0);
        return theaterMapper.toTheaterResponse(theaterRepository.save(theater));
    }

    @Override
    public TheaterResponse updateTheater(Long id, TheaterRequest request) {
        TheaterEntity theater = theaterRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        theaterMapper.updateTheater(theater, request);
        return theaterMapper.toTheaterResponse(theaterRepository.save(theater));
    }

    @Override
    public void deleteTheater(Long id) {
        if(!theaterRepository.existsById(id)){
            throw new AppException(ErrorCode.THEATER_NOT_FOUND);
        }
        theaterRepository.deleteById(id);
    }

    @Override
    public Page<TheaterResponse> getAllTheater(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<TheaterEntity> listTheater = theaterRepository.findAll(pageable);
        if (listTheater.isEmpty()) {
            throw new AppException(ErrorCode.THEATER_NOT_FOUND);
        }
        return listTheater.map(theaterMapper::toTheaterResponse);
    }

    @Override
    public TheaterResponse getDetailTheater(Long id) {
        TheaterEntity theater = theaterRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.THEATER_NOT_FOUND));
        return theaterMapper.toTheaterResponse(theater);
    }

    @Override
    public List<TheaterResponse> getTheatersByCity(String city) {
        List<TheaterEntity> theaters = theaterRepository.findByCity(city);
        if (theaters .isEmpty()) {
            throw new AppException(ErrorCode.THEATER_NOT_FOUND);
        }
        return theaters.stream().map(theaterMapper::toTheaterResponse).toList();
    }
}
