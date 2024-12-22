// SurveillanceController.java
package com.example.jeeproject.controllers;

import com.example.jeeproject.dto.AssignSurveillantRequest;
import com.example.jeeproject.entity.Enseignant;
import com.example.jeeproject.entity.Examen;
import com.example.jeeproject.entity.Local;
import com.example.jeeproject.services.SurveillanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/surveillance")
public class SurveillanceController {

    @Autowired
    private SurveillanceService surveillanceService;

   
    @GetMapping("/emploi")
    public ResponseEntity<?> getEmploiSurveillance(
            @RequestParam Long sessionId,
            @RequestParam Long departementId) {
        try {
            List<Map<String, Object>> emploi = surveillanceService.getEmploiSurveillance(sessionId, departementId);
            if (emploi == null || emploi.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Aucune assignation trouvée.");
            }
            return ResponseEntity.ok(emploi);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur interne : " + e.getMessage()));
        }
    }


    @GetMapping("/examens")
    public ResponseEntity getExamens(
        @RequestParam LocalDate date,
        @RequestParam String horaire,
        @RequestParam Long sessionId) {
        List<Examen> examens = surveillanceService.getExamensByDateAndHoraire(date, horaire, sessionId);
        // Vérifier que toutes les relations sont chargées
        examens.forEach(examen -> {
            examen.getDepartement();
            examen.getSession();
            examen.getOption();
            examen.getModuleExamen();
        });
        return ResponseEntity.ok(examens);
    }

    @GetMapping("/enseignants-disponibles")
    public ResponseEntity getEnseignantsDisponibles(
            @RequestParam Long departementId,
            @RequestParam LocalDate date,
            @RequestParam String periode) {
        return ResponseEntity.ok(surveillanceService.getEnseignantsDisponibles(departementId, date, periode));
    }

    @GetMapping("/locaux-disponibles")
    public ResponseEntity getLocauxDisponibles(
            @RequestParam LocalDate date,
            @RequestParam String horaire) {
        return ResponseEntity.ok(surveillanceService.getLocauxDisponibles(date, horaire));
    }

    @PostMapping("/assigner")
    public ResponseEntity<?> assignerSurveillant(@RequestBody AssignSurveillantRequest request) {
        try {
            boolean success = surveillanceService.assignerSurveillant(request);

            return ResponseEntity.ok().body(Map.of("message", "Surveillant assigné avec succès."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur interne: " + e.getMessage()));
        }
    }
    
    
    

}