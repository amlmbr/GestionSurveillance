package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {
    
    @Query("SELECT l FROM Local l WHERE l.estDisponible = true")
    List<Local> findDisponibles();

    @Query("SELECT l FROM Local l WHERE l.estDisponible = true " +
           "AND l.id NOT IN (SELECT sa.local.id FROM SurveillanceAssignation sa " +
           "WHERE sa.examen.date = :date AND sa.examen.horaire = :horaire)")
    List<Local> findLocauxDisponibles(LocalDate date, String horaire);
    Optional<Local> findLocalByNom(String nom);
}