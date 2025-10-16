package com.ngp.MovieService.Repository;

import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.MovieEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<MovieEntity, Long>, JpaSpecificationExecutor<MovieEntity> {
    boolean existsByTitle(String title);

    @Query(
            value = "SELECT m FROM MovieEntity m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%'))"
    )
    Page<MovieEntity> searchByMovieName(@Param("keyword") String keyword, Pageable pageable);
}
