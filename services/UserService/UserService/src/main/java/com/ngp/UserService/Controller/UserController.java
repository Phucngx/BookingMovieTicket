package com.ngp.UserService.Controller;

import com.ngp.UserService.DTO.Request.UserRequest;
import com.ngp.UserService.DTO.Response.ApiResponse;
import com.ngp.UserService.DTO.Response.UserResponse;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Service.User.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    UserService userService;

    @PutMapping("/update/{id}")
    public ApiResponse<UserResponse> update(@PathVariable Long id, @RequestBody UserRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(userService.updateUser(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Long id){
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("User has been deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<UserResponse>> getAll(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size){
        return ApiResponse.<Page<UserResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(userService.getAllUser(page, size))
                .build();
    }

    @GetMapping("/getDetail/{id}")
    public ApiResponse<UserResponse> getDetail(@PathVariable Long id){
        return ApiResponse.<UserResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(userService.getDetailUser(id))
                .build();
    }

//    @PostMapping("/search")
//    public ApiResponse<Page<UserResponse>> search(@RequestBody UserSearchRequest request,
//                                                  @RequestParam(name = "page") int page,
//                                                  @RequestParam(name = "size") int size){
//        return ApiResponse.<Page<UserResponse>>builder()
//                .data(userService.searchUser(request, page, size))
//                .build();
//    }
}
