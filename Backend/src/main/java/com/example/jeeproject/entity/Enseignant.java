package com.example.jeeproject.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enseignant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  
    
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "Email non valide")
    private String email;
	private boolean estDispense;
    private int nbSurveillances;
    private boolean estReserviste;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    //@JsonBackReference
    @JsonBackReference("enseignant-departement")  // Ajout du nom de référence
    private Departement departement;

	@OneToMany(mappedBy = "responsable",cascade = CascadeType.ALL, orphanRemoval = true)
    //@JsonBackReference("module-enseignant")
    @JsonManagedReference("module-enseignant")  // Changé en JsonManagedReference
    private List<Module> modulesResponsables;

}