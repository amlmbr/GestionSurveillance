package com.example.jeeproject.controllers;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.services.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/departements")
@CrossOrigin(origins = "*")
public class DepartementController {
    private final DepartementService departementService;

    @Autowired
    public DepartementController(DepartementService departementService) {
        this.departementService = departementService;
    }

    @GetMapping
    public ResponseEntity<List<Departement>> getAllDepartements() {
        return ResponseEntity.ok(departementService.getAllDepartements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getDepartementById(@PathVariable Long id) {
        return ResponseEntity.ok(departementService.getDepartementById(id));
    }

    @GetMapping("/{id}/enseignants")
    public ResponseEntity<List<Enseignant>> getEnseignantsByDepartementId(@PathVariable Long id) {
        return ResponseEntity.ok(departementService.getEnseignantsByDepartementId(id));
    }

    @PostMapping
    public ResponseEntity<Departement> createDepartement(@Valid @RequestBody Departement departement) {
        return new ResponseEntity<>(departementService.createDepartement(departement), HttpStatus.CREATED);
    }

    // Nouvel endpoint pour ajouter un enseignant à un département
    @PostMapping("/{departementId}/enseignants")
    public ResponseEntity<Enseignant> addEnseignantToDepartement(
            @PathVariable Long departementId,
            @Valid @RequestBody Enseignant enseignant) {
        Enseignant addedEnseignant = departementService.addEnseignantToDepartement(departementId, enseignant);
        return new ResponseEntity<>(addedEnseignant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departement> updateDepartement(@PathVariable Long id,
                                                         @Valid @RequestBody Departement departement) {
        return ResponseEntity.ok(departementService.updateDepartement(id, departement));
    }

    @PatchMapping("/{departementId}/enseignants/{enseignantId}/remove")
    public ResponseEntity<Enseignant> removeEnseignantFromDepartement(
            @PathVariable Long departementId,
            @PathVariable Long enseignantId
    ) {
        System.out.println("------------->departementId : "+departementId);
        System.out.println("------------->enseignantId : "+enseignantId);

        Enseignant enseignant = departementService.removeEnseignantFromDepartement(enseignantId, departementId);
        return ResponseEntity.ok(enseignant);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartement(@PathVariable Long id) {
        departementService.deleteDepartement(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/enseignants-par-departement")
    public Map<String, Integer> getNombreEnseignantsParDepartement() {
        return departementService.getNombreEnseignantsParDepartement();
    }


    @GetMapping("/{id}/options")
    public ResponseEntity<List<Option>> getOptionsByDepartementId(@PathVariable Long id) {
        List<Option> options = departementService.getOptionsByDepartementId(id);
        return ResponseEntity.ok(options);
    }
    
}