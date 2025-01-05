package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class AutoSurveillanceService {

    @Autowired private ExamenRepository examenRepository;
    @Autowired private EnseignantRepository enseignantRepository;
    @Autowired private SurveillanceAssignationRepository surveillanceAssignationRepository;
    @Autowired private SessionRepository sessionRepository;

    @Transactional
    public List<SurveillanceAssignation> assignerSurveillanceAutomatique(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));
        session.setConfirmed(!session.isConfirmed());
        sessionRepository.save(session);
        if(session.isConfirmed()) {
            List<SurveillanceAssignation> assignments = new ArrayList<>();
            List<Examen> examens = examenRepository.findExamsBySessionId(sessionId);
            List<Enseignant> enseignantsDisponibles = enseignantRepository.findEnseignantByEstDispenseFalse();

            examens.sort(Comparator.comparing(Examen::getDate).thenComparing(Examen::getHoraire));

            for (Examen examen : examens) {
                for (Local local : examen.getLocaux()) {
                    // First, assign the module leader if available
                    Optional<Enseignant> moduleLeader = enseignantsDisponibles.stream()
                            .filter(e -> e.getModulesResponsables().stream()
                                    .anyMatch(module -> module.getId().equals(examen.getModuleExamen().getId())))
                            .findFirst();

                    int remainingSurveillants = local.getNbSurveillants();

                    if (moduleLeader.isPresent() && !enseignantDejaAssignePourPeriode(moduleLeader.get().getId(), examen.getDate(), examen.getHoraire())) {
                        SurveillanceAssignation ttAssignation = creerAssignation(
                                examen,
                                moduleLeader.get(),
                                local,
                                "TT",
                                session
                        );
                        assignments.add(surveillanceAssignationRepository.save(ttAssignation));
                        // Don't increment surveillance count for TT
                    }

                    // Find remaining surveillants excluding the module leader
                    List<Enseignant> surveillantsForLocal = trouverSurveillantsDisponibles(
                            enseignantsDisponibles,
                            examen.getDate(),
                            examen.getHoraire(),
                            examen.getDepartement().getId(),
                            remainingSurveillants,
                            moduleLeader.orElse(null)
                    );

                    for (Enseignant surveillant : surveillantsForLocal) {
                        SurveillanceAssignation assignation = creerAssignation(
                                examen,
                                surveillant,
                                local,
                                "PRINCIPAL",
                                session
                        );
                        assignments.add(surveillanceAssignationRepository.save(assignation));
                        incrementerNbSurveillances(surveillant);
                    }
                }
            }
            return assignments;
        }
        return null;

    }

    private List<Enseignant> trouverSurveillantsDisponibles(
            List<Enseignant> enseignants,
            LocalDate date,
            String horaire,
            Long departementId,
            int nbRequired,
            Enseignant moduleLeader) {

        return enseignants.stream()
                .filter(e -> e.getDepartement().getId().equals(departementId))
                .filter(e -> !enseignantDejaAssignePourPeriode(e.getId(), date, horaire))
                .filter(e -> moduleLeader == null || !e.getId().equals(moduleLeader.getId()))
                .sorted(Comparator.comparing(Enseignant::getNbSurveillances))
                .limit(nbRequired)
                .toList();
    }

    // Other methods remain unchanged
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

    private boolean enseignantDejaAssignePourPeriode(Long enseignantId, LocalDate date, String horaire) {
        return surveillanceAssignationRepository.findByEnseignantAndDate(enseignantId, date)
                .stream()
                .anyMatch(sa -> sa.getExamen().getHoraire().equals(horaire));
    }

    private void incrementerNbSurveillances(Enseignant enseignant) {
        enseignant.setNbSurveillances(enseignant.getNbSurveillances() + 1);
        enseignantRepository.save(enseignant);
    }
}