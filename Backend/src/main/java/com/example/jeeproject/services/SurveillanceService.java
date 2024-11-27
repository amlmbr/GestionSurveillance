
package com.example.jeeproject.services;

import com.example.jeeproject.entity.Enseignant;
import com.example.jeeproject.entity.Examen;
import com.example.jeeproject.entity.Local;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SurveillanceService {
    List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId);
    List<Examen> getExamensByDateAndHoraire(LocalDate date, String horaire, Long sessionId);
    boolean assignerSurveillant(Long examenId, Long enseignantId, Long localId, String typeSurveillant);
    List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode);
    List<Local> getLocauxDisponibles(LocalDate date, String horaire);
    boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant);
    int getNombreSurveillantRequis(int nbEtudiants);
}