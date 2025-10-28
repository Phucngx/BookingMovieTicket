package com.ngp.BookingService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailsResponse {
    Long accountId;
    String username;
    Integer status;
    String roleName;
}
