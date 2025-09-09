package com.ngp.MovieService.Repository;

import com.ngp.MovieService.Entity.ActorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ActorRepository extends JpaRepository<ActorEntity, Long>, JpaSpecificationExecutor<ActorEntity> {
    boolean existsByName(String name);
}
