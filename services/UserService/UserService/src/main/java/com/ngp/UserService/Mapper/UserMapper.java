package com.ngp.UserService.Mapper;

import com.ngp.UserService.DTO.Request.UserRequest;
import com.ngp.UserService.DTO.Response.UserResponse;
import com.ngp.UserService.Entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    UserEntity toUser(UserRequest request);
    UserResponse toUserResponse(UserEntity users);
    void updateUser(@MappingTarget UserEntity users, UserRequest request);
//    UserExportResponse toUserExportResponse(UserEntity users);
//    RoleGetResponse toRoleGetResponse(Roles roles);
}
