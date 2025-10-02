package com.ngp.UserService.Repository;

import com.ngp.UserService.Entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RoleRepository extends JpaRepository<RoleEntity, Long>, JpaSpecificationExecutor<RoleEntity> {
    boolean existsByRoleName(String roleName);
    RoleEntity findByRoleName(String roleName);
}
