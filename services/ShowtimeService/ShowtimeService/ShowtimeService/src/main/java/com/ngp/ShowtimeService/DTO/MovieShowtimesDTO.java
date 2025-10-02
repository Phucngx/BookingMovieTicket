package com.ngp.ShowtimeService.DTO;

import com.ngp.ShowtimeService.DTO.Response.MovieLiteResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieShowtimesDTO {
    MovieLiteResponse movie;
    List<ShowtimeItemDTO> showtimes = new ArrayList<>();
}
