package com.ngp.UserService.Mapper;

import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.RoleResponse;
import com.ngp.UserService.Entity.RoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoleMapper {
    RoleEntity toRole(RoleRequest request);
    RoleResponse toRoleResponse(RoleEntity role);
    void updateRole(@MappingTarget RoleEntity role, RoleRequest request);
}
