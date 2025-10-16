package com.ngp.BookingService.Repository;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.Entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    BookingEntity findByPaymentId(Long paymentId);
    List<BookingEntity> findByStatusAndHoldExpiresAtBefore(StatusType status, LocalDateTime now);
    List<BookingEntity> findByAccountId(Long accountId);

    List<BookingEntity> findByAccountIdAndCreatedAtBetween(Long accountId, LocalDateTime start, LocalDateTime end);

    @Query("""
        select b.createdAt, b.totalPrice
        from BookingEntity b
        where b.status = :paidStatuses
          and b.createdAt >= :start and b.createdAt < :end
    """)
    List<Object[]> findCreatedAtAndAmountBetween(
            @Param("paidStatuses") StatusType paidStatuses,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        select coalesce(sum(b.totalPrice),0)
        from BookingEntity b
        where b.status = :paidStatuses
          and b.createdAt >= :start and b.createdAt < :end
    """)
    Double sumAmountBetween(
            @Param("paidStatuses") StatusType paidStatuses,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

//    @Query("select b from Bookings b where b.bookingId=:bookingId and b.status='COMPLETED'")
//    List<BookingEntity> findBookings(@Param("bookingId") Long bookingId);
}
