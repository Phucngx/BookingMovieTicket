package com.ngp.UserService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailResponse {
    Long accountId;
    String username;
    Integer status;
    UserResponse user;
    String roleName;
}
