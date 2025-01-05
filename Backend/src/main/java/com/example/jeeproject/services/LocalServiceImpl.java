package com.example.jeeproject.services;


import com.example.jeeproject.entity.Local;
import com.example.jeeproject.repo.LocalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class LocalServiceImpl implements LocalService {
    private final LocalRepository localRepository;

    @Autowired
    public LocalServiceImpl(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    @Override
    public List<Local> getAllLocaux() {
        return localRepository.findAll();
    }

    @Override
    public Local getLocalById(Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local non trouvé avec l'id: " + id));
    }
    @Override
    public Local createLocal(Local local) {
        if (localRepository.findLocalByNom(local.getNom()).isPresent()) {
            return null;
        }
        return localRepository.save(local);
    }


    @Override
    public Local updateLocal(Long id, Local local) {
        Local existingLocal = getLocalById(id);
        existingLocal.setNom(local.getNom());
        existingLocal.setCapacite(local.getCapacite());
        existingLocal.setType(local.getType());
        existingLocal.setNbSurveillants(local.getNbSurveillants());
        existingLocal.setEstDisponible(local.isEstDisponible());
        return localRepository.save(existingLocal);
    }
    @Override
    public void deleteLocal(Long id) {
        localRepository.deleteById(id);
    }
    @Override
    public List<Local> getLocauxDisponibles(LocalDate date, String horaire) {
        return localRepository.findLocauxDisponibles(date, horaire);
    }
}
