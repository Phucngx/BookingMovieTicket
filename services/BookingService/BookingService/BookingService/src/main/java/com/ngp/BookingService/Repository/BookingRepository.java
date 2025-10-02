package com.ngp.BookingService.Repository;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.Entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    BookingEntity findByPaymentId(Long paymentId);
    List<BookingEntity> findByStatusAndHoldExpiresAtBefore(StatusType status, LocalDateTime now);
    List<BookingEntity> findByAccountId(Long accountId);
}
