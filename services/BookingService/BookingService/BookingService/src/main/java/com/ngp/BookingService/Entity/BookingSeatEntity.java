package com.ngp.BookingService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "booking_seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class BookingSeatEntity extends BaseEntity{
    @Id
    @Column(name = "booking_seat_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long bookingSeatId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    BookingEntity booking;

    @Column(name = "seat_id", nullable = false)
    Long seatId;
}
