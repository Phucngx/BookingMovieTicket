package com.ngp.UserService.Repository;

import com.ngp.UserService.Entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long>, JpaSpecificationExecutor<AccountEntity> {
    Optional<AccountEntity> findByUsername(String username);
    boolean existsByUsername(String username);

    @Query("""
     select a from AccountEntity a
     join fetch a.user u
     join fetch a.role r
     where a.accountId = :id
     """)
    Optional<AccountEntity> findDetailById(@Param("id") Long id);
}
