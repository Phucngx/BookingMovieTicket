package com.ngp.UserService.Service.Role;

import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.RoleResponse;
import org.springframework.data.domain.Page;

public interface IRoleService {
    RoleResponse createRole(RoleRequest request);
    RoleResponse updateRole(Long id, RoleRequest request);
    void deleteRole(Long id);
    Page<RoleResponse> getAllRoles(int page, int size);
    Page<RoleResponse> getAllRolesNotAdmin(int page, int size);
}
