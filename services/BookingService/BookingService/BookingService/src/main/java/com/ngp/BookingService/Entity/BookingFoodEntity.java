package com.ngp.BookingService.Entity;

import com.ngp.BookingService.Constrains.StatusType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "booking_foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class BookingFoodEntity extends BaseEntity{
    @Id
    @Column(name = "booking_food_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long bookingFoodId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    BookingEntity booking;

    @Column(name = "food_id", nullable = false)
    Long foodId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    StatusType status;
}
