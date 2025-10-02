package com.ngp.BookingService.Entity;

import com.ngp.BookingService.Constrains.StatusType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class BookingEntity extends BaseEntity{
    @Id
    @Column(name = "booking_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long bookingId;

    @Column(name = "account_id", nullable = false)
    Long accountId;

    @Column(name = "showtime_id", nullable = false)
    Long showtimeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    StatusType status;

    @Column(name = "total_price", nullable = false)
    Double totalPrice;

    @Column(name="hold_id")
    String holdId;

    @Column(name="hold_expires_at")
    LocalDateTime holdExpiresAt;

    @Column(name = "payment_id")
    Long paymentId;
}
