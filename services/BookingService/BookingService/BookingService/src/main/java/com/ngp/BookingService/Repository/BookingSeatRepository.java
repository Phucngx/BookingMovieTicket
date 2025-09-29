package com.ngp.BookingService.Repository;

import com.ngp.BookingService.Entity.BookingSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeatEntity, Long> {
    List<BookingSeatEntity> findByBooking_BookingId(Long bookingId);
}
