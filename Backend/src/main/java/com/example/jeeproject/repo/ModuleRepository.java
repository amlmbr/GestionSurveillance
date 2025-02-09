package com.example.jeeproject.repo;

import com.example.jeeproject.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    Module findModuleByNom(String nom);
}
