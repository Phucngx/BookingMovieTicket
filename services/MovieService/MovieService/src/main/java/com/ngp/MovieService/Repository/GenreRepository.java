package com.ngp.MovieService.Repository;

import com.ngp.MovieService.Entity.GenreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<GenreEntity, Long>, JpaSpecificationExecutor<GenreEntity> {
    boolean existsByGenreName(String genreName);
}
