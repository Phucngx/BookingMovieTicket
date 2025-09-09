package com.ngp.UserService.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    String fullName;
    String email;
    String phone;
    String address;
    LocalDateTime dob;
    String avatarUrl;
}
