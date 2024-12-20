package com.example.jeeproject.services;

import com.example.jeeproject.entity.Departement;
import com.example.jeeproject.entity.Option;
import com.example.jeeproject.repo.DepartementRepository;
import com.example.jeeproject.repo.OptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import  com.example.jeeproject.dto.OptionDTO ;
import java.util.List;
import java.util.stream.Collectors;


// OptionService.java
@Service
public class OptionService {
    private final OptionRepository optionRepository;
    private final DepartementRepository departementRepository;


    @Autowired
    public OptionService(OptionRepository optionRepository, DepartementRepository departementRepository) {
        this.optionRepository = optionRepository;
        this.departementRepository = departementRepository;
    }


    public List<OptionDTO> getAllOptions() {
        List<Option> options = optionRepository.findAll();
        return options.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OptionDTO convertToDTO(Option option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setNom(option.getNom());

        if (option.getDepartement() != null) {
            dto.setDepartementNom(option.getDepartement().getNom());
        }

        return dto;
    }

    public Option getOptionById(Long id) {
        return optionRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Option non trouvée avec l'id: " + id));
    }

    public Option createOption(Option option) {
        return optionRepository.save(option);
    }

    public Option updateOption(Long id, Option optionDetails) {
        try {
            System.out.println("Updating option with id: " + id);
            System.out.println("Option details received: " + optionDetails);

            // Récupérer l'option existante
            Option existingOption = getOptionById(id);

            // Mettre à jour le nom
            existingOption.setNom(optionDetails.getNom());

            // Mettre à jour le département si fourni
            if (optionDetails.getDepartement() != null) {
                Long departementId = optionDetails.getDepartement().getId();
                if (departementId != null) {
                    Departement newDepartement = departementRepository.findById(departementId)
                            .orElseThrow(() -> new RuntimeException("Département non trouvé avec id: " + departementId));
                    existingOption.setDepartement(newDepartement);
                }
            }

            // Sauvegarder et retourner
            return optionRepository.save(existingOption);

        } catch (Exception e) {
            System.err.println("Error updating option: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour de l'option: " + e.getMessage());
        }
    }

    public void deleteOption(Long id) {
        optionRepository.deleteById(id);
    }
}