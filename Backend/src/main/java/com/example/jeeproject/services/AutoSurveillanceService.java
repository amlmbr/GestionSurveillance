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

    // Injection des dépendances pour les repositories utilisés
    @Autowired private ExamenRepository examenRepository;
    @Autowired private EnseignantRepository enseignantRepository;
    @Autowired private SurveillanceAssignationRepository surveillanceAssignationRepository;
    @Autowired private SessionRepository sessionRepository;

    /**
     * Assigner automatiquement des surveillances à une session donnée.
     * @param sessionId L'identifiant de la session.
     * @return Une liste d'assignations de surveillance.
     */
    @Transactional
    public List<SurveillanceAssignation> assignerSurveillanceAutomatique(Long sessionId) {
        // Récupération de la session à partir de l'ID
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        // Inversion de l'état de confirmation de la session
        session.setConfirmed(!session.isConfirmed());
        sessionRepository.save(session);

        // Si la session est confirmée, procéder à l'assignation automatique
        if(session.isConfirmed()) {
            List<SurveillanceAssignation> assignments = new ArrayList<>();

            // Récupération des examens et des enseignants disponibles
            List<Examen> examens = examenRepository.findExamsBySessionId(sessionId);
            List<Enseignant> enseignantsDisponibles = enseignantRepository.findEnseignantByEstDispenseFalse();

            // Tri des examens par date, puis par horaire
            examens.sort(Comparator.comparing(Examen::getDate).thenComparing(Examen::getHoraire));

            // Parcourir chaque examen
            for (Examen examen : examens) {
                for (Local local : examen.getLocaux()) {
                    // Assigner en priorité le responsable de module, s'il est disponible
                    Optional<Enseignant> moduleLeader = enseignantsDisponibles.stream()
                            .filter(e -> e.getModulesResponsables().stream()
                                    .anyMatch(module -> module.getId().equals(examen.getModuleExamen().getId())))
                            .findFirst();

                    int remainingSurveillants = local.getNbSurveillants();

                    // Vérification et assignation du responsable de module
                    if (moduleLeader.isPresent() && !enseignantDejaAssignePourPeriode(moduleLeader.get().getId(), examen.getDate(), examen.getHoraire())) {
                        SurveillanceAssignation ttAssignation = creerAssignation(
                                examen,
                                moduleLeader.get(),
                                local,
                                "TT", // Type de surveillant (responsable total)
                                session
                        );
                        assignments.add(surveillanceAssignationRepository.save(ttAssignation));
                    }

                    // Trouver les surveillants restants pour le local
                    List<Enseignant> surveillantsForLocal = trouverSurveillantsDisponibles(
                            enseignantsDisponibles,
                            examen.getDate(),
                            examen.getHoraire(),
                            examen.getDepartement().getId(),
                            remainingSurveillants,
                            moduleLeader.orElse(null)
                    );

                    // Assigner les surveillants restants
                    for (Enseignant surveillant : surveillantsForLocal) {
                        SurveillanceAssignation assignation = creerAssignation(
                                examen,
                                surveillant,
                                local,
                                "PRINCIPAL", // Type de surveillant (principal)
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

    /**
     * Trouver les enseignants disponibles pour surveiller un examen.
     * @param enseignants La liste des enseignants disponibles.
     * @param date La date de l'examen.
     * @param horaire L'horaire de l'examen.
     * @param departementId L'identifiant du département.
     * @param nbRequired Le nombre de surveillants requis.
     * @param moduleLeader Le responsable de module, à exclure si déjà assigné.
     * @return Une liste d'enseignants disponibles.
     */
    private List<Enseignant> trouverSurveillantsDisponibles(
            List<Enseignant> enseignants,
            LocalDate date,
            String horaire,
            Long departementId,
            int nbRequired,
            Enseignant moduleLeader) {

        return enseignants.stream()
                .filter(e -> e.getDepartement().getId().equals(departementId)) // Filtrer par département
                .filter(e -> !enseignantDejaAssignePourPeriode(e.getId(), date, horaire)) // Filtrer ceux non assignés
                .filter(e -> moduleLeader == null || !e.getId().equals(moduleLeader.getId())) // Exclure le responsable de module
                .sorted(Comparator.comparing(Enseignant::getNbSurveillances)) // Trier par le nombre de surveillances
                .limit(nbRequired) // Limiter au nombre requis
                .toList();
    }

    /**
     * Créer une assignation de surveillance.
     */
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

    /**
     * Vérifie si un enseignant est déjà assigné pour une période donnée.
     */
    private boolean enseignantDejaAssignePourPeriode(Long enseignantId, LocalDate date, String horaire) {
        return surveillanceAssignationRepository.findByEnseignantAndDate(enseignantId, date)
                .stream()
                .anyMatch(sa -> sa.getExamen().getHoraire().equals(horaire));
    }

    /**
     * Incrémente le nombre de surveillances d'un enseignant.
     */
    private void incrementerNbSurveillances(Enseignant enseignant) {
        enseignant.setNbSurveillances(enseignant.getNbSurveillances() + 1);
        enseignantRepository.save(enseignant);
    }
}
