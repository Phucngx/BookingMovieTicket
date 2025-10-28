package com.ngp.MovieService.Controller;

import com.ngp.MovieService.DTO.Request.MovieRequest;
import com.ngp.MovieService.DTO.Request.MovieSearchRequest;
import com.ngp.MovieService.DTO.Response.ApiResponse;
import com.ngp.MovieService.DTO.Response.MovieBriefResponse;
import com.ngp.MovieService.DTO.Response.MovieLiteResponse;
import com.ngp.MovieService.DTO.Response.MovieResponse;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Service.Genre.GenreService;
import com.ngp.MovieService.Service.Movie.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/movies")
public class MovieController {
    MovieService movieService;

    @PostMapping("/create")
    public ApiResponse<MovieResponse> addMovie(@RequestBody MovieRequest request) {
        return ApiResponse.<MovieResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.addMovie(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<MovieResponse> updateMovie(@PathVariable Long id, @RequestBody MovieRequest request) {
        return ApiResponse.<MovieResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.updateMovie(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Movie deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<MovieResponse>> getAllMovies(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<MovieResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.getAllMovies(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<MovieResponse> getDetailMovie(@PathVariable Long id) {
        return ApiResponse.<MovieResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.getMovieById(id))
                .build();
    }

    @GetMapping("/internal/get-movie/{id}")
    public ApiResponse<MovieBriefResponse> getMovieBrief(@PathVariable Long id) {
        return ApiResponse.<MovieBriefResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.getMovieBrief(id))
                .build();
    }

    @PostMapping("/internal/get-movie-lites")
    public List<MovieLiteResponse> getMovieLites(@RequestBody List<Long> movieIds) {
        return movieService.findAllByMovieIds(movieIds);
    }

    @PostMapping("/search")
    public ApiResponse<Page<MovieResponse>> searchMovie(
            @RequestBody MovieSearchRequest request,
            @RequestParam(name = "page") int page,
            @RequestParam(name = "size") int size
    ) {
        return ApiResponse.<Page<MovieResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(movieService.searchMovies(request, page, size))
                .build();
    }
}
