package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {

}
