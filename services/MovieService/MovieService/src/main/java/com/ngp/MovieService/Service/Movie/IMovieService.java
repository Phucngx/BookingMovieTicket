package com.ngp.MovieService.Service.Movie;

import com.ngp.MovieService.DTO.Request.MovieRequest;
import com.ngp.MovieService.DTO.Response.MovieBriefResponse;
import com.ngp.MovieService.DTO.Response.MovieLiteResponse;
import com.ngp.MovieService.DTO.Response.MovieResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IMovieService {
    MovieResponse addMovie(MovieRequest request);
    MovieResponse updateMovie(Long movieId, MovieRequest request);
    void deleteMovie(Long movieId);
    MovieResponse getMovieById(Long movieId);
    Page<MovieResponse> getAllMovies(int page, int size);
    MovieBriefResponse getMovieBrief(Long movieId);
    List<MovieLiteResponse> findAllByMovieIds(List<Long> Ids);
}
