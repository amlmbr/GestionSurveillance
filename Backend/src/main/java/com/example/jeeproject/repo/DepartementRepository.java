package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {
    public Optional<Departement> findByNom(String nom);
}