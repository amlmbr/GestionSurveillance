
package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Enseignant;
import com.example.jeeproject.entity.SurveillanceAssignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SurveillanceAssignationRepository extends JpaRepository<SurveillanceAssignation, Long> {
    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa " +
           "WHERE sa.enseignant.id = :enseignantId AND sa.examen.date = :date")
    int countByEnseignantAndDate(Long enseignantId, LocalDate date);

    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa WHERE sa.examen.id = :examenId")
    int countByExamen(Long examenId);

    @Query("SELECT COUNT(sa) FROM SurveillanceAssignation sa " +
           "WHERE sa.examen.date = :date AND sa.typeSurveillant = 'RESERVISTE' " +
           "AND CASE WHEN :periode = 'MATIN' " +
           "THEN sa.examen.horaire IN ('start1-end1', 'start2-end2') " +
           "ELSE sa.examen.horaire IN ('start3-end3', 'start4-end4') END")
    int countReservistesForDateAndPeriode(LocalDate date, String periode);

    @Query("SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END FROM SurveillanceAssignation sa " +
           "WHERE sa.enseignant.id = :enseignantId AND sa.examen.date = :date " +
           "AND CASE WHEN :periode = 'MATIN' " +
           "THEN sa.examen.horaire IN ('start1-end1', 'start2-end2') " +
           "ELSE sa.examen.horaire IN ('start3-end3', 'start4-end4') END")
    boolean existsByEnseignantAndDateAndPeriode(Long enseignantId, LocalDate date, String periode);
    @Query("SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END FROM SurveillanceAssignation sa " +
    	       "WHERE sa.enseignant.id = :enseignantId AND sa.examen.id = :examenId")
    	boolean existsByEnseignantAndExamen(Long enseignantId, Long examenId);
    
    @Query("SELECT e FROM Enseignant e WHERE e.departement.id = :departementId " +
    	       "AND NOT EXISTS (SELECT sa FROM SurveillanceAssignation sa " +
    	       "WHERE sa.enseignant.id = e.id AND sa.examen.date = :date " +
    	       "AND CASE WHEN :periode = 'MATIN' " +
    	       "THEN sa.examen.horaire IN ('start1-end1', 'start2-end2') " +
    	       "ELSE sa.examen.horaire IN ('start3-end3', 'start4-end4') END)")
    	List<Enseignant> findEnseignantsDisponiblesPourSurveillance(Long departementId, LocalDate date, String periode);

}