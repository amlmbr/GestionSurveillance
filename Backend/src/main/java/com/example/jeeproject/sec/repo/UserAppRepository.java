package com.example.jeeproject.sec.repo;

import com.example.jeeproject.sec.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAppRepository extends JpaRepository<AppUser, Long> {
    AppUser findByUsername(String username);
    AppUser findByEmail(String email);
}