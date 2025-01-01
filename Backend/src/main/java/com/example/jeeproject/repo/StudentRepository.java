package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
	@Query("SELECT s FROM Student s LEFT JOIN FETCH s.option")
    List<Student> findAll();
    
    List<Student> findByOptionId(Long optionId);
}