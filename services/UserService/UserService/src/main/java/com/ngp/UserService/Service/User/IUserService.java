package com.ngp.UserService.Service.User;

import com.ngp.UserService.DTO.Request.UserRequest;
import com.ngp.UserService.DTO.Response.UserResponse;
import com.ngp.UserService.Entity.UserEntity;
import org.springframework.data.domain.Page;

public interface IUserService {
    UserEntity createUser(UserEntity user);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
    Page<UserResponse> getAllUser(int page, int size);
    UserResponse getDetailUser(Long id);
    //    Page<UserResponse> searchUser(UserSearchRequest request, int page, int size);
    UserResponse getMyInfo();
}
