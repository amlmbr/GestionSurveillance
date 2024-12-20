package com.example.jeeproject.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'option est obligatoire")
    private String nom;

    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    //@JsonBackReference("module-option")
    @JsonManagedReference("module-option")  // Changé en JsonManagedReference
    private List<Module> modules = new ArrayList<>() ; // Une option peut avoir plusieurs modules

    @ManyToOne
    @JoinColumn(name = "departement_id", nullable = false) // Clé étrangère vers Departement
    @JsonBackReference("departement-option") // Pour éviter la récursion dans la sérialisation JSON
    private Departement departement; // Chaque option appartient à un seul département
}
