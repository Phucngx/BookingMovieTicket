package com.ngp.UserService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    Long roleId;
    String roleName;
    String description;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
