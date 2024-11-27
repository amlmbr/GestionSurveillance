package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Enseignant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByEmail(String email);
    
    @Query("SELECT e FROM Enseignant e WHERE e.departement.id = :departementId " +
            "AND e.id NOT IN (SELECT sa.enseignant.id FROM SurveillanceAssignation sa " +
            "WHERE sa.examen.date = :date AND CASE " +
            "WHEN :periode = 'MATIN' THEN sa.examen.horaire IN ('start1-end1', 'start2-end2') " +
            "ELSE sa.examen.horaire IN ('start3-end3', 'start4-end4') END)")
     List<Enseignant> findEnseignantsDisponiblesPourSurveillance(
         Long departementId, LocalDate date, String periode);
    long countByEstDispense(boolean estDispense);
}