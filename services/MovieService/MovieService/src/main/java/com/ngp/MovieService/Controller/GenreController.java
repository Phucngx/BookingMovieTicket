package com.ngp.MovieService.Controller;

import com.ngp.MovieService.DTO.Request.GenreRequest;
import com.ngp.MovieService.DTO.Response.ApiResponse;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Service.Genre.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/genres")
public class GenreController {
    GenreService genreService;

    @PostMapping("/create")
    public ApiResponse<GenreResponse> addGenre(@RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(genreService.addGenre(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<GenreResponse> updateGenre(@PathVariable Long id, @RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(genreService.updateGenre(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Genre deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<GenreResponse>> getAllGenres(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<GenreResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(genreService.getAllGenres(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<GenreResponse> getDetailGenre(@PathVariable Long id) {
        return ApiResponse.<GenreResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(genreService.getGenreById(id))
                .build();
    }
}
