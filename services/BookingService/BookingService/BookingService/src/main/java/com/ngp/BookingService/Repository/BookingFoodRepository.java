package com.ngp.BookingService.Repository;

import com.ngp.BookingService.Entity.BookingEntity;
import com.ngp.BookingService.Entity.BookingFoodEntity;
import com.ngp.BookingService.Entity.BookingSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingFoodRepository extends JpaRepository<BookingFoodEntity, Long> {
    BookingFoodEntity[] findByBooking(BookingEntity booking);
    List<BookingFoodEntity> findByBooking_BookingId(Long bookingId);
}
