package com.ngp.UserService.DTO.Response;

import com.ngp.UserService.Entity.RoleEntity;
import com.ngp.UserService.Entity.UserEntity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {
    Long accountId;
    String username;
    Integer status;
    String roleName;

    Long userId;
    String fullName;
    String avatarUrl;
    String email;
    String phone;
    String address;
}
