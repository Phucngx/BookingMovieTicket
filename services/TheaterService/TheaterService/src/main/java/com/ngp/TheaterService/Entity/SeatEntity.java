package com.ngp.TheaterService.Entity;

import com.ngp.TheaterService.Contrains.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "Seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class SeatEntity extends BaseEntity{
    @Id
    @Column(name = "seat_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long seatId;

    @Column(name = "seat_row", nullable = false)
    Character seatRow;

    @Column(name = "seat_number", nullable = false)
    Integer seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_type", nullable = false)
    SeatType seatType;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    RoomEntity room;
}
