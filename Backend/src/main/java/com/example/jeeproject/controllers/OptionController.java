package com.example.jeeproject.controllers;

import com.example.jeeproject.dto.OptionDTO;
import com.example.jeeproject.entity.Option;
import com.example.jeeproject.services.OptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// OptionController.java
@RestController
@RequestMapping("/options")
@CrossOrigin(origins = "*", methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
}, allowedHeaders = "*")
public class OptionController {

    private final OptionService optionService;

    @Autowired
    public OptionController(OptionService optionService) {
        this.optionService = optionService;
    }

    @GetMapping
    public ResponseEntity<List<OptionDTO>> getAllOptions() {
        return ResponseEntity.ok(optionService.getAllOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Option> getOptionById(@PathVariable Long id) {
        return ResponseEntity.ok(optionService.getOptionById(id));
    }

    @PostMapping
    public ResponseEntity<Option> createOption(@Valid @RequestBody Option option) {
        return new ResponseEntity<>(optionService.createOption(option), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OptionDTO> updateOption(
            @PathVariable Long id,
            @Valid @RequestBody Option option) {
        Option updatedOption = optionService.updateOption(id, option);
        return ResponseEntity.ok(convertToDTO(updatedOption));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Long id) {
        optionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method pour convertir en DTO
    private OptionDTO convertToDTO(Option option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setNom(option.getNom());
        if (option.getDepartement() != null) {
            dto.setDepartementNom(option.getDepartement().getNom());
        }
        return dto;
    }
}