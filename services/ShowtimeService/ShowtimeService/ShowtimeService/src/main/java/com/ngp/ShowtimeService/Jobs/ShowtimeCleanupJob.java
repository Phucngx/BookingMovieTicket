package com.ngp.ShowtimeService.Jobs;

import com.ngp.ShowtimeService.Entity.ShowtimeEntity;
import com.ngp.ShowtimeService.Repository.ShowtimeRepository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShowtimeCleanupJob {
    private final ShowtimeRepository showtimeRepository;

    @Scheduled(fixedRate = 60_000) // chạy mỗi phút
    public void updateShowtimeStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<ShowtimeEntity> expiredShowtime =
                showtimeRepository.findByStatusAndStartTimeBefore("ACTIVE", now);

        for (ShowtimeEntity showtime : expiredShowtime) {
            showtime.setStatus("INACTIVE");
            showtimeRepository.save(showtime);
            log.info("Showtime {} update status to INACTIVE", showtime.getShowtimeId());
        }
    }
}