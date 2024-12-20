package com.example.jeeproject.services;


import com.example.jeeproject.entity.*;

import java.util.List;
import java.util.Map;

public interface DepartementService {
    List<Departement> getAllDepartements();
    Departement getDepartementById(Long id);
    Departement createDepartement(Departement departement);
    Departement updateDepartement(Long id, Departement departement);
    void deleteDepartement(Long id);
    List<Enseignant> getEnseignantsByDepartementId(Long departementId);
    List<Option> getOptionsByDepartementId(Long departementId);
    Enseignant addEnseignantToDepartement(Long departementId, Enseignant enseignant);
    public Map<String, Integer> getNombreEnseignantsParDepartement();
}
