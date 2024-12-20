// ModuleService.java
package com.example.jeeproject.services;

import com.example.jeeproject.dto.ModuleDTO;
import com.example.jeeproject.entity.Module;
import com.example.jeeproject.repo.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleService {
    private final ModuleRepository moduleRepository;

    @Autowired
    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<ModuleDTO> getAllModules() {
        List<Module> modules = moduleRepository.findAll();
        return modules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ModuleDTO convertToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setNom(module.getNom());

        if (module.getResponsable() != null) {
            dto.setResponsableNom(module.getResponsable().getNom());
        }

        if (module.getOption() != null) {
            dto.setOptionNom(module.getOption().getNom());
        }

        return dto;
    }

    public Module getModuleById(Long id) {
        return moduleRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Module non trouvé avec l'id: " + id));
    }

    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    public Module updateModule(Long id, Module moduleDetails) {
        Module module = getModuleById(id);
        module.setNom(moduleDetails.getNom());
        module.setResponsable(moduleDetails.getResponsable());
        module.setOption(moduleDetails.getOption());
        return moduleRepository.save(module);
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}