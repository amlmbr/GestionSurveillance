package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.repo.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class ExamenServiceImpl implements ExamenService {

    private final ExamenRepository examenRepository;
    private final LocalRepository localRepository;
    
    @Autowired
    public ExamenServiceImpl(ExamenRepository examenRepository, LocalRepository localRepository) {
        this.examenRepository = examenRepository;
        this.localRepository = localRepository;
    }

    @Override
    public List<Examen> getExamensBySessionDateHoraire(Long sessionId, LocalDate date, String horaire) {
        return examenRepository.findBySessionIdAndDateAndHoraire(sessionId, date, horaire);
    }

    @Override
    public Examen createExamen(Examen examen) {
        // Si les IDs des locaux sont fournis, récupérer les entités Local complètes
        if (examen.getLocaux() != null && !examen.getLocaux().isEmpty()) {
            Set<Local> locauxEntities = examen.getLocaux().stream()
            		.map(local -> (Local) localRepository.findById(Long.valueOf(local.getId()))
            			    .orElseThrow(() -> new RuntimeException("Local non trouvé avec l'id: " + local.getId())))
            		.collect(Collectors.toSet());
            examen.setLocaux(locauxEntities);
        }
        return examenRepository.save(examen);
    }


    

    @Override
    public Examen updateExamen(Long id, Examen examen) {
        Examen existingExamen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'id: " + id));

        // Mettre à jour les champs
        existingExamen.setSession(examen.getSession());
        existingExamen.setDepartement(examen.getDepartement());
        existingExamen.setEnseignant(examen.getEnseignant());
        existingExamen.setLocaux(examen.getLocaux());
        existingExamen.setOption(examen.getOption());
        existingExamen.setModuleExamen(examen.getModuleExamen());  
        existingExamen.setDate(examen.getDate());
        existingExamen.setHoraire(examen.getHoraire());
        existingExamen.setNbEtudiants(examen.getNbEtudiants());

        return examenRepository.save(existingExamen);
    }

    @Override
    public void deleteExamen(Long id) {
        if (!examenRepository.existsById(id)) {
            throw new RuntimeException("Examen non trouvé avec l'id: " + id);
        }
        examenRepository.deleteById(id);
    }
}