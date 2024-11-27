package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.repo.*;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class SurveillanceServiceImpl implements SurveillanceService {

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private SurveillanceAssignationRepository surveillanceAssignationRepository;

    @Autowired
    private LocalRepository localRepository;

    @Override
    public List<Map<String, Object>> getEmploiSurveillance(Long sessionId, Long departementId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session non trouvée"));

        LocalDate currentDate = session.getDateDebut();
        LocalDate endDate = session.getDateFin();

        List<Map<String, Object>> emploi = new ArrayList<>();

        while (!currentDate.isAfter(endDate)) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", currentDate);

            Map<String, List<Map<String, Object>>> horaires = new HashMap<>();
            String[] slots = {"start1-end1", "start2-end2", "start3-end3", "start4-end4"};

            for (String slot : slots) {
                List<Examen> examens = examenRepository.findByDateAndHoraireAndSessionAndDepartement(
                    currentDate, slot, sessionId, departementId);
                List<Local> locauxDisponibles = localRepository.findLocauxDisponibles(currentDate, slot);

                List<Map<String, Object>> slotData = new ArrayList<>();
                for (Examen examen : examens) {
                    Map<String, Object> examenData = new HashMap<>();
                    examenData.put("examen", examen);
                    examenData.put("locauxDisponibles", locauxDisponibles);
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
    public boolean assignerSurveillant(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        // Validation des paramètres
        Examen examen = examenRepository.findById(examenId)
            .orElseThrow(() -> new RuntimeException("Examen non trouvé"));
        
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
            .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        
        Local local = localRepository.findById(localId)
            .orElseThrow(() -> new RuntimeException("Local non trouvé"));

        // Vérification des contraintes
        if (!verifierContraintesSurveillance(examenId, enseignantId, localId, typeSurveillant)) {
            throw new RuntimeException("Impossible d'assigner le surveillant. Contraintes non respectées.");
        }

        // Créer l'assignation de surveillance
        SurveillanceAssignation assignation = new SurveillanceAssignation();
        assignation.setExamen(examen);
        assignation.setEnseignant(enseignant);
        assignation.setLocal(local);
        assignation.setTypeSurveillant(typeSurveillant);

        // Sauvegarder l'assignation
        surveillanceAssignationRepository.save(assignation);

        return true;
    }

    @Override
    public boolean verifierContraintesSurveillance(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        Examen examen = examenRepository.findById(examenId)
            .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        // Remove the check for existing assignment to the same exam
        // This allows multiple surveillants for the same exam

        // Vérifier la disponibilité de l'enseignant pour la date et la période
        LocalDate dateExamen = examen.getDate();
        String periode = getperiodeFromHoraire(examen.getHoraire());
        
        if (surveillanceAssignationRepository.existsByEnseignantAndDateAndPeriode(enseignantId, dateExamen, periode)) {
            throw new RuntimeException("L'enseignant est déjà assigné à un autre examen durant cette période");
        }

        // Vérifier le nombre maximum de surveillants par examen
        int nombreSurveillants = surveillanceAssignationRepository.countByExamen(examenId);
        int nombreSurveillantsRequis = getNombreSurveillantRequis(examen.getNbEtudiants());

        if (nombreSurveillants >= nombreSurveillantsRequis) {
            throw new RuntimeException("Nombre maximum de surveillants atteint pour cet examen");
        }

        // Vérifier la limite des réservistes
        if (typeSurveillant.equals("RESERVISTE")) {
            int nombreReservistes = surveillanceAssignationRepository.countReservistesForDateAndPeriode(dateExamen, periode);
            if (nombreReservistes >= 2) { // Limite de 2 réservistes par période
                throw new RuntimeException("Nombre maximum de réservistes atteint pour cette période");
            }
        }

        return true;
    }
    @Override
    public int getNombreSurveillantRequis(int nbEtudiants) {
        // Logique de calcul du nombre de surveillants requis
        if (nbEtudiants <= 30) return 1;
        if (nbEtudiants <= 60) return 2;
        return 3;
    }

    private String getperiodeFromHoraire(String horaire) {
        // Déterminer la période (MATIN ou APRES-MIDI) en fonction de l'horaire
        if (horaire.equals("start1-end1") || horaire.equals("start2-end2")) {
            return "MATIN";
        }
        return "APRES-MIDI";
    }
    @Override
    public List<Enseignant> getEnseignantsDisponibles(Long departementId, LocalDate date, String periode) {
        return enseignantRepository.findEnseignantsDisponiblesPourSurveillance(departementId, date, periode);
    }

    @Override
    public List<Local> getLocauxDisponibles(LocalDate date, String horaire) {
        return localRepository.findLocauxDisponibles(date, horaire);
    }

  

    private String getPeriodeFromHoraire(String horaire) {
        return horaire.startsWith("start1") || horaire.startsWith("start2") ? "MATIN" : "APRES_MIDI";
    }
}
