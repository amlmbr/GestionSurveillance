package com.example.jeeproject.services;

import com.example.jeeproject.entity.Examen;

import java.time.LocalDate;
import java.util.List;

public interface ExamenService {
    List<Examen> getExamensBySessionDateHoraire(Long sessionId, LocalDate date, String horaire);
    Examen createExamen(Examen examen);
    Examen updateExamen(Long id, Examen examen);
    void deleteExamen(Long id);

}