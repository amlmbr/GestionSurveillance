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

    @Query(value = "SELECT * " +
            "FROM local l " +
            "WHERE l.`est_disponible` = true " +
            "AND l.id NOT IN ( " +
            "  SELECT e.local_id " +
            "  FROM examen ex, examen_locaux e " +
            "  WHERE ex.date = :date AND ex.horaire = :horaire " +
            "  AND ex.id = e.examen_id " +
            ")", nativeQuery = true)
    List<Local> findLocauxDisponibles(LocalDate date, String horaire);

    Optional<Local> findLocalByNom(String nom);


}