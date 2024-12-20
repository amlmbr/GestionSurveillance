// ModuleController.java
package com.example.jeeproject.controllers;

import com.example.jeeproject.dto.ModuleDTO;
import com.example.jeeproject.entity.Module;
import com.example.jeeproject.services.ModuleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modules")
@CrossOrigin(origins = "*")
public class ModuleController {
    private final ModuleService moduleService;

    @Autowired
    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PostMapping
    public ResponseEntity<Module> createModule(@Valid @RequestBody Module module) {
        return new ResponseEntity<>(moduleService.createModule(module), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(
            @PathVariable Long id,
            @Valid @RequestBody Module module) {
        return ResponseEntity.ok(moduleService.updateModule(id, module));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}