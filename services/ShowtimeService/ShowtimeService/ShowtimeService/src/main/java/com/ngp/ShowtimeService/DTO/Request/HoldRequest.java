package com.ngp.ShowtimeService.DTO.Request;

import com.ngp.ShowtimeService.Entity.LockSeatId;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class HoldRequest {
    Long showtimeId;
    List<Long> seatIds;
    Integer ttlSeconds;
}

