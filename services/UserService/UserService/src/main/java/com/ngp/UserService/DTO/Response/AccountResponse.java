package com.ngp.UserService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    Long accountId;
    String username;
    Integer status;
    String fullName;
    String roleName;
}
