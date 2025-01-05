package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.entity.Module;
import com.example.jeeproject.repo.*;
import com.example.jeeproject.dto.AssignSurveillantRequest;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SurveillanceServiceImpl implements SurveillanceService {

    @Autowired private ExamenRepository examenRepository;
    @Autowired private EnseignantRepository enseignantRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private SurveillanceAssignationRepository surveillanceAssignationRepository;
    @Autowired private LocalRepository localRepository;
    @Autowired private DepartementRepository departementRepository;
    @Autowired private OptionRepository optionRepository;
    @Autowired private ModuleRepository moduleRepository;

    public List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId) {
        // Récupérer la session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        LocalDate currentDate = session.getDateDebut();
        LocalDate endDate = session.getDateFin();
        List<Map<String, Object>> emploi = new ArrayList<>();

        // Créer les créneaux horaires à partir de la session
        List<String> slots = generateTimeSlots(session);

        while (!currentDate.isAfter(endDate)) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", currentDate);

            Map<String, List<Map<String, Object>>> horaires = new HashMap<>();

            for (String slot : slots) {
                List<Examen> examens = examenRepository.findByDateAndHoraireAndSessionAndDepartement(
                        currentDate, slot, sessionId, departementId);

                List<Map<String, Object>> surveillantsParSlot = new ArrayList<>();

                for (Examen examen : examens) {
                    List<SurveillanceAssignation> assignations = surveillanceAssignationRepository.findByExamenId(examen.getId());
                    for (SurveillanceAssignation assignation : assignations) {
                        Map<String, Object> surveillantData = new HashMap<>();
                        surveillantData.put("enseignant", assignation.getEnseignant());
                        surveillantData.put("typeSurveillant", assignation.getTypeSurveillant());
                        surveillantData.put("local", assignation.getLocal());
                        surveillantData.put("surveillanceId", assignation.getId()); // Ajouter l'ID de la surveillance
                        surveillantsParSlot.add(surveillantData);
                    }
                }

                horaires.put(slot, surveillantsParSlot);
            }

            dayData.put("horaires", horaires);
            emploi.add(dayData);
            currentDate = currentDate.plusDays(1);
        }

        return emploi;
    }

    private List<String> generateTimeSlots(Session session) {
        List<String> slots = new ArrayList<>();

        // Ajouter les créneaux uniquement s'ils sont définis dans la session
        if (session.getStart1() != null && session.getEnd1() != null) {
            slots.add(session.getStart1() + "-" + session.getEnd1());
        }
        if (session.getStart2() != null && session.getEnd2() != null) {
            slots.add(session.getStart2() + "-" + session.getEnd2());
        }
        if (session.getStart3() != null && session.getEnd3() != null) {
            slots.add(session.getStart3() + "-" + session.getEnd3());
        }
        if (session.getStart4() != null && session.getEnd4() != null) {
            slots.add(session.getStart4() + "-" + session.getEnd4());
        }

        return slots;
    }

    private String getPeriodeFromHoraire(String horaire, Session session) {
        // On considère que les deux premiers créneaux sont le matin
        if (horaire.startsWith(session.getStart1()) || horaire.startsWith(session.getStart2())) {
            return "MATIN";
        }
        return "APRES_MIDI";
    }

    // Les autres méthodes restent identiques, mais utilisez session pour les horaires
    // Par exemple dans verifierContraintesSurveillance :




    @Override
    public List<Examen> getExamensByDateAndHoraire(LocalDate date, String horaire, Long sessionId) {
        return examenRepository.findBySessionIdAndDateAndHoraire(sessionId, date, horaire);
    }

    @Override
    @Transactional
    public boolean assignerSurveillant(AssignSurveillantRequest request) {
        try {
            // Validation des entités
            Examen examen = examenRepository.findById(request.getExamenId())
                    .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

            Enseignant enseignant = enseignantRepository.findById(request.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

            Local local = localRepository.findById(request.getLocalId())
                    .orElseThrow(() -> new RuntimeException("Local non trouvé"));

            Departement departement = departementRepository.findById(request.getDepartementId())
                    .orElseThrow(() -> new RuntimeException("Département non trouvé"));

            Session session = sessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session non trouvée"));

            Option option = optionRepository.findById(request.getOptionId())
                    .orElseThrow(() -> new RuntimeException("Option non trouvée"));

            Module module = moduleRepository.findById(request.getModuleId())
                    .orElseThrow(() -> new RuntimeException("Module non trouvé"));

            // Vérification des contraintes
            if (!verifierContraintesSurveillance(
                    request.getExamenId(),
                    request.getEnseignantId(),
                    request.getLocalId(),
                    request.getTypeSurveillant())) {
                throw new RuntimeException("Les contraintes de surveillance ne sont pas respectées");
            }

            // Création de l'assignation
            SurveillanceAssignation assignation = new SurveillanceAssignation();
            assignation.setExamen(examen);
            assignation.setEnseignant(enseignant);
            assignation.setLocal(local);
            assignation.setTypeSurveillant(request.getTypeSurveillant());
            assignation.setDepartement(departement);
            assignation.setSession(session);
            assignation.setOption(option);
            assignation.setModule(module);

            surveillanceAssignationRepository.save(assignation);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'assignation: " + e.getMessage());
        }
    }

    @Override
    public boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        Examen examen = examenRepository.findById(examenId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        LocalDate dateExamen = examen.getDate();
        String periode = getPeriodeFromHoraire(examen.getHoraire());

        if (surveillanceAssignationRepository.existsByEnseignantAndDateAndPeriode(enseignantId, dateExamen, periode)) {
            throw new RuntimeException("L'enseignant est déjà assigné à un autre examen durant cette période");
        }

        int nombreSurveillants = surveillanceAssignationRepository.countByExamen(examenId);
        int nombreSurveillantsRequis = getNombreSurveillantRequis(examen.getNbEtudiants());

        if (nombreSurveillants >= nombreSurveillantsRequis) {
            throw new RuntimeException("Nombre maximum de surveillants atteint pour cet examen");
        }

        if (typeSurveillant.equals("RESERVISTE")) {
            int nombreReservistes = surveillanceAssignationRepository.countReservistesForDateAndPeriode(dateExamen, periode);
            if (nombreReservistes >= 2) {
                throw new RuntimeException("Nombre maximum de réservistes atteint pour cette période");
            }
        }

        return true;
    }

    @Override
    public int getNombreSurveillantRequis(int nbEtudiants) {
        if (nbEtudiants <= 30) return 1;
        if (nbEtudiants <= 60) return 2;
        return 3;
    }

    @Override
    public List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode) {
        return surveillanceAssignationRepository.findEnseignantsDisponiblesPourSurveillance(departementId, date, periode);
    }



    private String getPeriodeFromHoraire(String horaire) {
        return horaire.startsWith("start1") || horaire.startsWith("start2") ? "MATIN" : "APRES_MIDI";
    }

    @Override
    public List<Map<String, Object>> getAssignationsSurveillance(Long sessionId, Long departementId, LocalDate date) {
        List<SurveillanceAssignation> assignations;

        if (date != null) {
            assignations = surveillanceAssignationRepository.findByDate(date);
        } else if (sessionId != null && departementId != null) {
            assignations = surveillanceAssignationRepository.findBySessionAndDepartement(sessionId, departementId);
        } else if (sessionId != null) {
            assignations = surveillanceAssignationRepository.findBySessionId(sessionId);
        } else {
            assignations = surveillanceAssignationRepository.findByDepartementId(departementId);
        }

        return assignations.stream().map(assignation -> {
            Map<String, Object> assignationData = new HashMap<>();
            assignationData.put("id", assignation.getId());
            assignationData.put("examen", Map.of(
                    "id", assignation.getExamen().getId(),
                    "date", assignation.getExamen().getDate(),
                    "horaire", assignation.getExamen().getHoraire()
            ));
            assignationData.put("enseignant", Map.of(
                    "id", assignation.getEnseignant().getId(),
                    "nom", assignation.getEnseignant().getNom(),
                    "prenom", assignation.getEnseignant().getPrenom()
            ));
            assignationData.put("local", Map.of(
                    "id", assignation.getLocal().getId(),
                    "nom", assignation.getLocal().getNom()
            ));
            assignationData.put("typeSurveillant", assignation.getTypeSurveillant());

            return assignationData;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean modifierAssignation(Long assignationId, String localId, String typeSurveillant) {
        SurveillanceAssignation assignation = surveillanceAssignationRepository.findById(assignationId)
                .orElseThrow(() -> new RuntimeException("Assignation non trouvée"));

        Local local = localRepository.findLocalByNom(localId)
                .orElseThrow(() -> new RuntimeException("Local non trouvé"));

        assignation.setLocal(local);
        assignation.setTypeSurveillant(typeSurveillant);

        surveillanceAssignationRepository.save(assignation);
        return true;
    }

    @Override
    @Transactional
    public boolean supprimerAssignation(Long assignationId) {
        try {
            // Vérification explicite de l'existence
            Optional<SurveillanceAssignation> assignation =
                    surveillanceAssignationRepository.findById(assignationId);

            if (!assignation.isPresent()) {
                throw new EntityNotFoundException("Assignation avec ID " + assignationId + " non trouvée");
            }

            surveillanceAssignationRepository.delete(assignation.get());
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression de l'assignation: " + e.getMessage());
        }
    }







}