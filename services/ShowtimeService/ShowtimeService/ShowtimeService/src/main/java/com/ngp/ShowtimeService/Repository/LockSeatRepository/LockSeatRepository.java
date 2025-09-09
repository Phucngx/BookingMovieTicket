package com.ngp.ShowtimeService.Repository.LockSeatRepository;

import com.ngp.ShowtimeService.Entity.LockSeatEntity;
import com.ngp.ShowtimeService.Entity.LockSeatId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LockSeatRepository extends JpaRepository<LockSeatEntity, LockSeatId> {
    @Query("select ls.id.seatId from LockSeatEntity ls where ls.id.showtimeId=:showtimeId")
    List<Long> findReservedSeatIds(@Param("showtimeId") Long showtimeId);
}
