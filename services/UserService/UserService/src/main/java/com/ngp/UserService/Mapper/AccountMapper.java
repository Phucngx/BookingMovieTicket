package com.ngp.UserService.Mapper;

import com.ngp.UserService.DTO.Request.AccountRequest;
import com.ngp.UserService.DTO.Request.AccountUpdateRequest;
import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.AccountResponse;
import com.ngp.UserService.DTO.Response.RoleResponse;
import com.ngp.UserService.Entity.AccountEntity;
import com.ngp.UserService.Entity.RoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AccountMapper {
    AccountEntity toAccount(AccountRequest request);

    @Mapping(target = "roleName", source = "role.roleName")
    @Mapping(target = "fullName", source = "user.fullName")
    AccountResponse toAccountResponse(AccountEntity account);
    void updateAccount(@MappingTarget AccountEntity account, AccountUpdateRequest request);
}
