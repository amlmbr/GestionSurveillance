package com.example.jeeproject.services;

import com.example.jeeproject.dto.StatisticsDto;
import com.example.jeeproject.entity.Session;
import com.example.jeeproject.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class StatisticsService {
    @Autowired
    private LocalRepository salleRepository;
    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private DepartementRepository departementRepository;
    @Autowired
    private ExamenRepository examenRepository;
    @Autowired
    private SessionRepository sessionRepository;
    public StatisticsDto getStatistics(Long id) {
        long salles = salleRepository.count();
        long enseignants = enseignantRepository.count();
        long departements = departementRepository.count();
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session non trouvée"));
        long examens = examenRepository.countBySession(session);
        return new StatisticsDto(salles, enseignants, departements, examens);
    }
}