package com.ngp.UserService.Service.User;

import com.ngp.UserService.DTO.Request.UserRequest;
import com.ngp.UserService.DTO.Response.UserResponse;
import com.ngp.UserService.Entity.UserEntity;
import com.ngp.UserService.Exception.AppException;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Mapper.UserMapper;
import com.ngp.UserService.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserService implements IUserService{
    UserRepository userRepository;
    UserMapper userMapper;

    @Override
    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Page<UserResponse> getAllUser(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<UserEntity> listUser = userRepository.findAll(pageable);
        if (listUser.isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return listUser.map(userMapper::toUserResponse);
    }

    @Override
    public UserResponse getDetailUser(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getMyInfo() {
        return null;
    }
}
