package com.example.jeeproject.services;


import com.example.jeeproject.entity.Enseignant;
import com.example.jeeproject.repo.EnseignantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class EnseignantServiceImpl implements EnseignantService {

    private final EnseignantRepository enseignantRepository;

    @Autowired
    public EnseignantServiceImpl(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    @Override
    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    @Override
    public Enseignant getEnseignantById(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé avec l'id: " + id));
    }

    @Override
    public Enseignant createEnseignant(Enseignant enseignant) {
        // Vérifier si l'email existe déjà
        if (enseignantRepository.findByEmail(enseignant.getEmail()).isPresent()) {
            return null;
        }
     // Définir les valeurs par défaut
        enseignant.setNbSurveillances(0);
        enseignant.setEstReserviste(false);
        return enseignantRepository.save(enseignant);
    }

    @Override
    public Enseignant updateEnseignant(Long id, Enseignant enseignant) {
        Enseignant existingEnseignant = getEnseignantById(id);

        existingEnseignant.setNom(enseignant.getNom());
        existingEnseignant.setPrenom(enseignant.getPrenom());
        existingEnseignant.setEmail(enseignant.getEmail());
        existingEnseignant.setEstDispense(enseignant.isEstDispense());
        existingEnseignant.setNbSurveillances(enseignant.getNbSurveillances());
        existingEnseignant.setEstReserviste(enseignant.isEstReserviste());

        return enseignantRepository.save(existingEnseignant);
    }

    @Override
    public void deleteEnseignant(Long id) {
        enseignantRepository.deleteById(id);
    }
    @Override
    public Map<String, Double> getPercentageDispenses() {
        long totalEnseignants = enseignantRepository.count();
        long enseignantsDispenses = enseignantRepository.countByEstDispense(true);
        if (totalEnseignants == 0) {
            return Map.of(
                    "dispenses", 0.0,
                    "nonDispenses", 0.0
            );
        }
        double pourcentageDispenses = (enseignantsDispenses * 100.0) / totalEnseignants;
        double pourcentageNonDispenses = 100.0 - pourcentageDispenses;
        Map<String, Double> result = new HashMap<>();
        result.put("dispenses", pourcentageDispenses);
        result.put("nonDispenses", pourcentageNonDispenses);
        return result;
    }
}