package com.ngp.UserService.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
    @NotBlank(message = "Vui lòng nhập username")
    String username;

    @NotBlank(message = "Vui lòng nhập password")
    String password;

    @NotBlank(message = "Vui lòng nhâp email")
    String email;

    @NotBlank(message = "Vui lòng nhâp số điện thoại")
    String phone;
}
