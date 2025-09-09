package com.ngp.MovieService.Repository;

import com.ngp.MovieService.Entity.DirectorEntity;
import com.ngp.MovieService.Entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<MovieEntity, Long>, JpaSpecificationExecutor<MovieEntity> {
    boolean existsByTitle(String title);
}
