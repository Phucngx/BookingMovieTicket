package com.ngp.UserService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {
    String oldPassword;
    String newPassword;
}
