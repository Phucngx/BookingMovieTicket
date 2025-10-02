package com.ngp.BookingService.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@SuperBuilder
public class TicketEntity extends BaseEntity{
    @Id
    @Column(name = "ticket_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long ticketId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    BookingEntity booking;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "qr_code", nullable = false)
    String qrCode;
}
