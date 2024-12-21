package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.entity.Module;
import com.example.jeeproject.repo.*;
import com.example.jeeproject.dto.AssignSurveillantRequest;
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

    @Override
    public List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId) {
        // Récupérer la session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        LocalDate currentDate = session.getDateDebut();
        LocalDate endDate = session.getDateFin();
        List<Map<String, Object>> emploi = new ArrayList<>();

        while (!currentDate.isAfter(endDate)) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", currentDate);

            Map<String, List<Map<String, Object>>> horaires = new HashMap<>();
            String[] slots = {"08:00-10:00", "10:30-12:30", "14:00-16:00", "16:30-18:30"};

            for (String slot : slots) {
                List<Examen> examens = examenRepository.findByDateAndHoraireAndSessionAndDepartement(
                        currentDate, slot, sessionId, departementId);
                List<Local> locauxDisponibles = localRepository.findLocauxDisponibles(currentDate, slot);

                List<Map<String, Object>> slotData = new ArrayList<>();
                for (Examen examen : examens) {
                    Map<String, Object> examenData = new HashMap<>();
                    examenData.put("examen", examen);
                    examenData.put("locauxDisponibles", locauxDisponibles);

                    List<Map<String, Object>> surveillants = new ArrayList<>();
                    List<SurveillanceAssignation> assignations = surveillanceAssignationRepository.findByExamenId(examen.getId());
                    for (SurveillanceAssignation assignation : assignations) {
                        Map<String, Object> surveillantData = new HashMap<>();
                        surveillantData.put("enseignant", assignation.getEnseignant());
                        surveillantData.put("typeSurveillant", assignation.getTypeSurveillant());
                        surveillants.add(surveillantData);
                    }

                    examenData.put("surveillants", surveillants);
                    slotData.add(examenData);
                }

                horaires.put(slot, slotData);
            }

            dayData.put("horaires", horaires);
            emploi.add(dayData);
            currentDate = currentDate.plusDays(1);
        }

        return emploi;
    }


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

    @Override
    public List<Local> getLocauxDisponibles(LocalDate date, String horaire) {
        return localRepository.findLocauxDisponibles(date, horaire);
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
    
    

}