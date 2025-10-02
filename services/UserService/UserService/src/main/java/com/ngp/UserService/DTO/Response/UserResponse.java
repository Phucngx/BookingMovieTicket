package com.ngp.UserService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    String userId;
    String fullName;
    String email;
    LocalDate dob;
    String avatarUrl;
    String phone;
    String address;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
