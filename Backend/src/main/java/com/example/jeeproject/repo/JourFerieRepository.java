package com.example.jeeproject.repo;

import com.example.jeeproject.entity.JourFerie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface JourFerieRepository extends JpaRepository<JourFerie, Long> {
    boolean existsByDate(LocalDate date);

    @Query("SELECT jf FROM JourFerie jf WHERE jf.date BETWEEN :startDate AND :endDate")
    List<JourFerie> findBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
