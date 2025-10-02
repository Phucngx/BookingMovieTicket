package com.ngp.MovieService.Service.Director;

import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Exception.AppException;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Mapper.DirectorMapper;
import com.ngp.MovieService.Repository.DirectorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DirectorService implements IDirectorService{
    DirectorRepository directorRepository;
    DirectorMapper directorMapper;

    @Override
    public DirectorResponse addDirector(DirectorRequest request) {
        if(directorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.EXISTS);
        }
        var director = directorMapper.toDirector(request);
        return directorMapper.toDirectorResponse(directorRepository.save(director));
    }

    @Override
    public DirectorResponse updateDirector(Long directorId, DirectorRequest request) {
        DirectorEntity director = directorRepository.findById(directorId)
                .orElseThrow(() -> new AppException(ErrorCode.DIRECTOR_NOT_FOUND));
        directorMapper.updateDirector(director, request);
        return directorMapper.toDirectorResponse(directorRepository.save(director));
    }

    @Override
    public void deleteDirector(Long directorId) {
        if(!directorRepository.existsById(directorId)) {
            throw new AppException(ErrorCode.DIRECTOR_NOT_FOUND);
        }
        directorRepository.deleteById(directorId);
    }

    @Override
    public DirectorResponse getDirectorById(Long directorId) {
        DirectorEntity director = directorRepository.findById(directorId)
                .orElseThrow(() -> new AppException(ErrorCode.DIRECTOR_NOT_FOUND));
        return directorMapper.toDirectorResponse(director);
    }

    @Override
    public Page<DirectorResponse> getAllDirectors(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<DirectorEntity> directorPage = directorRepository.findAll(pageable);
        return directorPage.map(directorMapper::toDirectorResponse);
    }
}
