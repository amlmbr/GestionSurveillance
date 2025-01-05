package com.example.jeeproject.services;

import com.example.jeeproject.entity.JourFerie;
import com.example.jeeproject.repo.JourFerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class JourFerieService {

    private final JourFerieRepository jourFerieRepository;

    @Autowired
    public JourFerieService(JourFerieRepository jourFerieRepository) {
        this.jourFerieRepository = jourFerieRepository;
    }

    public JourFerie createJourFerie(JourFerie jourFerie) {
        return jourFerieRepository.save(jourFerie);
    }

    public List<JourFerie> getAllJoursFeries() {
        return jourFerieRepository.findAll();
    }

    public JourFerie updateJourFerie(Long id, JourFerie jourFerie) {
        JourFerie existingJourFerie = jourFerieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jour férié non trouvé avec l'id: " + id));

        existingJourFerie.setTitre(jourFerie.getTitre());
        existingJourFerie.setDate(jourFerie.getDate());

        return jourFerieRepository.save(existingJourFerie);
    }

    public List<JourFerie> getJoursFeriesBetweenDates(LocalDate startDate, LocalDate endDate) {
        return jourFerieRepository.findBetweenDates(startDate, endDate);
    }

    public void deleteJourFerie(Long id) {
        jourFerieRepository.deleteById(id);
    }

    public boolean isJourFerie(LocalDate date) {
        return jourFerieRepository.existsByDate(date);
    }
}
