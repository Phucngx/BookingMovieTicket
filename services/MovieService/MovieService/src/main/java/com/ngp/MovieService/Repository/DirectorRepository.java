package com.ngp.MovieService.Repository;

import com.ngp.MovieService.Entity.DirectorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<DirectorEntity, Long>, JpaSpecificationExecutor<DirectorEntity> {
    boolean existsByName(String name);
//    Optional<DirectorEntity> findDirectorById(Long directorId);
}
