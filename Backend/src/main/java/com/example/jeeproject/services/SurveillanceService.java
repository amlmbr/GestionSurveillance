package com.example.jeeproject.services;

import com.example.jeeproject.entity.Enseignant;
import com.example.jeeproject.entity.Examen;
import com.example.jeeproject.entity.Local;
import com.example.jeeproject.dto.AssignSurveillantRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SurveillanceService {
    List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId);
    
    List<Examen> getExamensByDateAndHoraire(LocalDate date, String horaire, Long sessionId);
    
    boolean assignerSurveillant(AssignSurveillantRequest request);
    
    List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode);

    boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant);
    
    List<Map<String, Object>> getAssignationsSurveillance(Long sessionId, Long departementId, LocalDate date);

    
    int getNombreSurveillantRequis(int nbEtudiants);
    
    boolean modifierAssignation(Long assignationId, String localId, String typeSurveillant);
    boolean supprimerAssignation(Long assignationId);

}