package com.ngp.MovieService.Service.Director;

import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import org.springframework.data.domain.Page;

public interface IDirectorService {
    DirectorResponse addDirector(DirectorRequest request);
    DirectorResponse updateDirector(Long directorId, DirectorRequest request);
    void deleteDirector(Long directorId);
    DirectorResponse getDirectorById(Long directorId);
    Page<DirectorResponse> getAllDirectors(int page, int size);
}
