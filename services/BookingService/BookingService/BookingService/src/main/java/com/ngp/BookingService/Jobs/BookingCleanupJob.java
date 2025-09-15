package com.ngp.BookingService.Jobs;

import com.ngp.BookingService.Constrains.StatusType;
import com.ngp.BookingService.Entity.BookingEntity;
import com.ngp.BookingService.Repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingCleanupJob {
    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60_000) // chạy mỗi phút
    public void expirePendingBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<BookingEntity> expiredBookings =
                bookingRepository.findByStatusAndHoldExpiresAtBefore(StatusType.PENDING, now);

        for (BookingEntity booking : expiredBookings) {
            booking.setStatus(StatusType.CANCELLED);
            bookingRepository.save(booking);
            log.info("Booking {} expired and cancelled", booking.getBookingId());
        }
    }
}
