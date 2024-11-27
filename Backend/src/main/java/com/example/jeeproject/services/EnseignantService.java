package com.example.jeeproject.services;

import com.example.jeeproject.entity.Enseignant;

import java.util.List;
import java.util.Map;

public interface EnseignantService {
    List<Enseignant> getAllEnseignants();
    Enseignant getEnseignantById(Long id);
    Enseignant createEnseignant(Enseignant enseignant);
    Enseignant updateEnseignant(Long id, Enseignant enseignant);
    void deleteEnseignant(Long id);
    public Map<String, Double> getPercentageDispenses();
}