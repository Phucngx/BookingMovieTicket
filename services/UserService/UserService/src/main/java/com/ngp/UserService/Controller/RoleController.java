package com.ngp.UserService.Controller;

import com.ngp.UserService.DTO.Request.RoleRequest;
import com.ngp.UserService.DTO.Response.ApiResponse;
import com.ngp.UserService.DTO.Response.RoleResponse;
import com.ngp.UserService.Entity.RoleEntity;
import com.ngp.UserService.Entity.UserEntity;
import com.ngp.UserService.Exception.ErrorCode;
import com.ngp.UserService.Service.Role.RoleService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/roles")
public class RoleController {
    RoleService roleService;

    @PostMapping("/create")
    public ApiResponse<RoleResponse> createRole(@Valid @RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roleService.createRole(request))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roleService.updateRole(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Role deleted successfully")
                .build();
    }

    @GetMapping("/get-all")
    public ApiResponse<Page<RoleResponse>> getAllRoles(@RequestParam(name = "page") int page, @RequestParam(name = "size") int size) {
        return ApiResponse.<Page<RoleResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .data(roleService.getAllRoles(page, size))
                .build();
    }
}
