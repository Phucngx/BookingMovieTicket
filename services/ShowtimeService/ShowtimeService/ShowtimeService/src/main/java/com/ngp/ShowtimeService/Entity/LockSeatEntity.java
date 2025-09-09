package com.ngp.ShowtimeService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "lock_seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class LockSeatEntity {
    @EmbeddedId
    LockSeatId id;

    @Column(name = "booking_id", nullable = false)
    Long bookingId;

    @Column(name = "reserved_at", nullable = false)
    LocalDateTime reservedAt;
}
