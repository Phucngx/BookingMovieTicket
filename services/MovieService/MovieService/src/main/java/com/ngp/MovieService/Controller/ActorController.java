package com.ngp.MovieService.Controller;

import com.ngp.MovieService.DTO.Request.ActorRequest;
import com.ngp.MovieService.DTO.Response.ApiResponse;
import com.ngp.MovieService.DTO.Response.ActorResponse;
import com.ngp.MovieService.DTO.Response.GenreResponse;
import com.ngp.MovieService.Exception.ErrorCode;
import com.ngp.MovieService.Service.Actor.ActorService;
import com.ngp.MovieService.Service.Genre.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/actors")
public class ActorController {
    ActorService actorService;

    @PostMapping("/create")
    public ApiResponse<ActorResponse> addActor(@RequestBody ActorRequest request) {
        return ApiResponse.<ActorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(actorService.addActor(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<ActorResponse> updateActor(@PathVariable Long id, @RequestBody ActorRequest request) {
        return ApiResponse.<ActorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(actorService.updateActor(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteActor(@PathVariable Long id) {
        actorService.deleteActor(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Actor deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<ActorResponse>> getAllActors(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<ActorResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(actorService.getAllActors(page, size))
                .build();
    }

    @GetMapping("/get-details/{id}")
    public ApiResponse<ActorResponse> getDetailActor(@PathVariable Long id) {
        return ApiResponse.<ActorResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(actorService.getActorById(id))
                .build();
    }
}
