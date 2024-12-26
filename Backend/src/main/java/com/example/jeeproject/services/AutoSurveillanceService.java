package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.repo.EnseignantRepository;
import com.example.jeeproject.repo.ExamenRepository;
import com.example.jeeproject.repo.SessionRepository;
import com.example.jeeproject.repo.SurveillanceAssignationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AutoSurveillanceService {

    @Autowired
    private ExamenRepository examenRepository;
    @Autowired private EnseignantRepository enseignantRepository;
    @Autowired private SurveillanceAssignationRepository surveillanceAssignationRepository;
    @Autowired private SessionRepository sessionRepository;

    @Transactional
    public List<SurveillanceAssignation> assignerSurveillanceAutomatique(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        List<SurveillanceAssignation> assignments = new ArrayList<>();
        List<Examen> examens = examenRepository.findExamsBySessionId(sessionId);
        List<Enseignant> enseignantsDisponibles = enseignantRepository.findEnseignantByEstDispenseFalse();

        examens.sort(Comparator.comparing(Examen::getDate).thenComparing(Examen::getHoraire));

        for (Examen examen : examens) {
            for (Local local : examen.getLocaux()) {
                int nbSurveillantsLocal = local.getNbSurveillants();

                for (int i = 0; i < nbSurveillantsLocal; i++) {
                    Optional<Enseignant> surveillant = trouverSurveillantDisponible(
                            enseignantsDisponibles,
                            examen.getDate(),
                            examen.getHoraire(),
                            examen.getDepartement().getId()
                    );

                    if (surveillant.isPresent()) {
                        SurveillanceAssignation assignation = creerAssignation(
                                examen,
                                surveillant.get(),
                                local,
                                i == 0 ? "PRINCIPAL" : "ASSISTANT",
                                session
                        );

                        assignments.add(surveillanceAssignationRepository.save(assignation));
                        incrementerNbSurveillances(surveillant.get());
                    }
                }
            }
        }

        return assignments;
    }

    private SurveillanceAssignation creerAssignation(
            Examen examen,
            Enseignant enseignant,
            Local local,
            String typeSurveillant,
            Session session) {

        SurveillanceAssignation assignation = new SurveillanceAssignation();
        assignation.setExamen(examen);
        assignation.setEnseignant(enseignant);
        assignation.setLocal(local);
        assignation.setTypeSurveillant(typeSurveillant);
        assignation.setDepartement(examen.getDepartement());
        assignation.setSession(session);
        assignation.setModule(examen.getModuleExamen());
        assignation.setOption(examen.getOption());

        return assignation;
    }

    private Optional<Enseignant> trouverSurveillantDisponible(
            List<Enseignant> enseignants,
            LocalDate date,
            String horaire,
            Long departementId) {

        return enseignants.stream()
                .filter(e -> !surveillanceAssignationRepository
                        .existsByEnseignantAndDateAndPeriode(
                                e.getId(),
                                date,
                                getPeriodeFromHoraire(horaire)
                        ))
                .min(Comparator.comparing(Enseignant::getNbSurveillances));
    }

    private void incrementerNbSurveillances(Enseignant enseignant) {
        enseignant.setNbSurveillances(enseignant.getNbSurveillances() + 1);
        enseignantRepository.save(enseignant);
    }

    private String getPeriodeFromHoraire(String horaire) {
        return horaire.startsWith("start1") || horaire.startsWith("start2")
                ? "MATIN" : "APRES_MIDI";
    }
}