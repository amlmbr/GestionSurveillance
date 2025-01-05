package com.example.jeeproject.controllers;

import com.example.jeeproject.entity.JourFerie;
import com.example.jeeproject.services.JourFerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/jours-feries")
public class JourFerieController {

    private final JourFerieService jourFerieService;

    @Autowired
    public JourFerieController(JourFerieService jourFerieService) {
        this.jourFerieService = jourFerieService;
    }

    @PostMapping
    public ResponseEntity<JourFerie> createJourFerie(@RequestBody JourFerie jourFerie) {
        return ResponseEntity.ok(jourFerieService.createJourFerie(jourFerie));
    }

    @GetMapping
    public ResponseEntity<List<JourFerie>> getAllJoursFeries() {
        return ResponseEntity.ok(jourFerieService.getAllJoursFeries());
    }

    @GetMapping("/between")
    public ResponseEntity<List<JourFerie>> getJoursFeriesBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(jourFerieService.getJoursFeriesBetweenDates(startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJourFerie(@PathVariable Long id) {
        jourFerieService.deleteJourFerie(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<JourFerie> updateJourFerie(@PathVariable Long id, @RequestBody JourFerie jourFerie) {
        JourFerie updatedJourFerie = jourFerieService.updateJourFerie(id, jourFerie);
        return ResponseEntity.ok(updatedJourFerie);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isJourFerie(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(jourFerieService.isJourFerie(date));
    }
}