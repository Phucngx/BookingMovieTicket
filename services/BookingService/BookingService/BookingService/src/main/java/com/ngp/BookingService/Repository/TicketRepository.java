package com.ngp.BookingService.Repository;

import com.ngp.BookingService.Entity.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, Long> {
    TicketEntity findByBooking_BookingId(Long bookingId);
}
