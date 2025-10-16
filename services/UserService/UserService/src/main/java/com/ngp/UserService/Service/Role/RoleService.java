package com.ngp.UserService.Service.Role;

import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.RoleResponse;
import com.ngp.UserService.Entity.RoleEntity;
import com.ngp.UserService.Exception.AppException;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Mapper.RoleMapper;
import com.ngp.UserService.Repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoleService implements IRoleService{
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    @Override
    public RoleResponse createRole(RoleRequest request) {
        if(roleRepository.existsByRoleName(request.getRoleName())){
            throw new AppException(ErrorCode.NOT_EXISTS);
        }
        RoleEntity role = roleMapper.toRole(request);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    @Override
    public RoleResponse updateRole(Long id, RoleRequest request) {
        RoleEntity role = roleRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        roleMapper.updateRole(role, request);
        return roleMapper.toRoleResponse(role);
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public Page<RoleResponse> getAllRoles(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<RoleEntity> listRoles = roleRepository.findAll(pageable);
        return listRoles.map(roleMapper::toRoleResponse);
    }

    @Override
    public Page<RoleResponse> getAllRolesNotAdmin(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<RoleEntity> listRoles = roleRepository.findByRoleNameNot("ADMIN", pageable);
        return listRoles.map(roleMapper::toRoleResponse);
    }
}
