package com.ngp.MovieService.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActorResponse {
    Long actorId;
    String name;
    String nationality;
    LocalDate birthDate;
    LocalDateTime createdAt;
}
