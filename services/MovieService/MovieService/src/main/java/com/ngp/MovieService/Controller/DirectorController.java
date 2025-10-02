package com.ngp.MovieService.Controller;

import com.ngp.MovieService.DTO.Request.DirectorRequest;
import com.ngp.MovieService.DTO.Response.DirectorResponse;
import com.ngp.MovieService.DTO.Response.ApiResponse;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Service.Actor.ActorService;
import com.ngp.MovieService.Service.Director.DirectorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/directors")
public class DirectorController {
    DirectorService directorService;

    @PostMapping("/create")
    public ApiResponse<DirectorResponse> addDirector(@RequestBody DirectorRequest request) {
        return ApiResponse.<DirectorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(directorService.addDirector(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<DirectorResponse> updateDirector(@PathVariable Long id, @RequestBody DirectorRequest request) {
        return ApiResponse.<DirectorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(directorService.updateDirector(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteDirector(@PathVariable Long id) {
        directorService.deleteDirector(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Director deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<DirectorResponse>> getAllDirectors(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<DirectorResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(directorService.getAllDirectors(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<DirectorResponse> getDetailDirector(@PathVariable Long id) {
        return ApiResponse.<DirectorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(directorService.getDirectorById(id))
                .build();
    }
}
