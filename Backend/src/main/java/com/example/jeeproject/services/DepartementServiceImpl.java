package com.example.jeeproject.services;

import com.example.jeeproject.entity.*;
import com.example.jeeproject.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartementServiceImpl implements DepartementService {
    private final DepartementRepository departementRepository;
    private final EnseignantRepository enseignantRepository;

    @Autowired
    public DepartementServiceImpl(DepartementRepository departementRepository,
                                  EnseignantRepository enseignantRepository) {
        this.departementRepository = departementRepository;
        this.enseignantRepository = enseignantRepository;
    }

    @Override
    public List<Departement> getAllDepartements() {
        return departementRepository.findAll();
    }

    @Override
    public Departement getDepartementById(Long id) {
        return departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé: " + id));
    }

    @Override
    public Departement createDepartement(Departement departement) {
        // Vérifie si un département avec le même nom existe déjà
        Optional<Departement> existingDepartement = departementRepository.findByNom(departement.getNom());
        if (existingDepartement.isPresent()) {
            // Si le département existe déjà, retourne l'existant sans rien faire
            System.out.println("Le département existe déjà : " + existingDepartement.get().getNom());
            return existingDepartement.get();
        }
        // Si non, sauvegarde et retourne le nouveau département
        return departementRepository.save(departement);
    }

    @Override
    public Departement updateDepartement(Long id, Departement departement) {
        Departement existingDept = getDepartementById(id);
        existingDept.setNom(departement.getNom());
        return departementRepository.save(existingDept);
    }

    @Override
    public void deleteDepartement(Long id) {
        departementRepository.deleteById(id);
    }

    @Override
    public List<Enseignant> getEnseignantsByDepartementId(Long departementId) {
        Departement departement = getDepartementById(departementId);
        return departement.getEnseignants();
    }
    
    @Override
    public List<Option> getOptionsByDepartementId(Long departementId) {
        Departement departement = getDepartementById(departementId);
        return departement.getOptions();
    }



    @Override
    public Enseignant addEnseignantToDepartement(Long departementId, Enseignant enseignant) {
        Departement departement = getDepartementById(departementId);
        enseignant.setDepartement(departement);
        Enseignant savedEnseignant = enseignantRepository.save(enseignant);
        departement.getEnseignants().add(savedEnseignant);
        departementRepository.save(departement);
        return savedEnseignant;
    }

    @Override
    public Enseignant removeEnseignantFromDepartement(Long enseignantId, Long departementId) {
        Departement departement = getDepartementById(departementId);
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé: " + enseignantId));

        if (enseignant.getDepartement() != null &&
                enseignant.getDepartement().getId().equals(departementId)) {
            enseignant.setDepartement(null);
            departement.getEnseignants().remove(enseignant);
            departementRepository.save(departement);
            return enseignantRepository.save(enseignant);
        }

        throw new RuntimeException("L'enseignant n'appartient pas à ce département");
    }

    @Override
    public Map<String, Integer> getNombreEnseignantsParDepartement() {
        List<Departement> departements = departementRepository.findAll();
        // On crée un map où chaque département a son nombre d'enseignants
        return departements.stream()
                .collect(Collectors.toMap(
                        Departement::getNom,
                        departement -> departement.getEnseignants().size()
                ));
    }
    
}