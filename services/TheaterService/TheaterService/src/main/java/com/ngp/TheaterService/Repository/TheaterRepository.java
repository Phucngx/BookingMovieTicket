package com.ngp.TheaterService.Repository;

import com.ngp.TheaterService.Entity.TheaterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TheaterRepository extends JpaRepository<TheaterEntity, Long>, JpaSpecificationExecutor<TheaterEntity> {
    boolean existsByTheaterName(String theaterName);
    List<TheaterEntity> findByCity(String city);
}
