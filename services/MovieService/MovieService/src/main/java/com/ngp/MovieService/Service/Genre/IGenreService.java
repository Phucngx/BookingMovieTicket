package com.ngp.MovieService.Service.Genre;

import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import org.springframework.data.domain.Page;

public interface IGenreService {
    GenreResponse addGenre(GenreRequest request);
    GenreResponse updateGenre(Long genreId, GenreRequest request);
    void deleteGenre(Long genreId);
    GenreResponse getGenreById(Long genreId);
    Page<GenreResponse> getAllGenres(int page, int size);
}
