package com.ngp.ShowtimeService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Showtimes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class ShowtimeEntity extends BaseEntity{
    @Id
    @Column(name = "showtime_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long showtimeId;

    @Column(name = "startTime", nullable = false)
    LocalDateTime startTime;

    @Column(name = "endTime", nullable = false)
    LocalDateTime endTime;

    @Column(name = "price", nullable = false)
    Double price;

    @Column(name = "movieId", nullable = false)
    Long movieId;

    @Column(name = "roomId", nullable = false)
    Long roomId;

    @Column(name = "status", nullable = false)
    String status;
}
