package com.ngp.ShowtimeService.Repository.ShowtimeRepository;

import com.ngp.ShowtimeService.Entity.ShowtimeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<ShowtimeEntity, Long>, JpaSpecificationExecutor<ShowtimeEntity> {
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM ShowtimeEntity s " +
            "WHERE s.movieId = :movieId AND s.roomId = :roomId " +
            "AND (s.startTime < :endTime AND s.endTime > :startTime)")
    boolean existsShowtime(@Param("movieId") Long movieId,
                           @Param("roomId") Long roomId,
                           @Param("startTime") LocalDateTime startTime,
                           @Param("endTime") LocalDateTime endTime);

    List<ShowtimeEntity> findByMovieId(Long movieId);

    @Query("SELECT s FROM ShowtimeEntity s " +
            "WHERE s.movieId = :movieId " +
            "AND s.roomId IN :roomIds " +
            "AND s.startTime BETWEEN :startOfDay AND :endOfDay")
    List<ShowtimeEntity> findShowtimes(
            @Param("movieId") Long movieId,
            @Param("roomIds") List<Long> roomIds,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("""
        select st from ShowtimeEntity st
        where st.roomId in :roomIds
          and st.startTime >= :start
          and st.startTime < :end
        order by st.startTime asc
    """)
    List<ShowtimeEntity> findByRoomIdsAndDate(
            @Param("roomIds") List<Long> roomIds,
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end
    );

    List<ShowtimeEntity> findByStatusAndStartTimeBefore(String status, LocalDateTime now);

}
