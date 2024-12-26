package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.example.jeeproject.entity.Session;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {
    List<Examen> findBySessionIdAndDateAndHoraire(Long sessionId, LocalDate date, String horaire);

    @Query("SELECT e FROM Examen e WHERE e.date = :date AND e.horaire = :horaire " +
            "AND e.session.id = :sessionId AND e.departement.id = :departementId")
     List<Examen> findByDateAndHoraireAndSessionAndDepartement(
         LocalDate date, String horaire, Long sessionId, Long departementId);
    long countBySession(Session session);
    @Query("SELECT e FROM Examen e WHERE e.session.id = :sessionId")
    List<Examen> findExamsBySessionId(Long sessionId);

}

