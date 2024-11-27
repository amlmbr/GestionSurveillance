package com.example.jeeproject.sec.repo;

import com.example.jeeproject.sec.entity.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRoleRepository extends JpaRepository<AppRole,Long> {
    AppRole findByRolename(String name);
}
