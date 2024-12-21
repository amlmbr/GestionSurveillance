package com.example.jeeproject.entity;

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
public class Departement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du département est obligatoire")
    private String nom;

    @OneToMany(mappedBy = "departement",  cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    //@JsonManagedReference
	@JsonManagedReference("enseignant-departement")  // Ajout du nom de référence
	private List<Enseignant> enseignants = new ArrayList<>();

	@OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
	@JsonManagedReference("departement-option") // Gère la relation avec les options
	private List<Option> options = new ArrayList<>(); // Un département peut avoir plusieurs options

}