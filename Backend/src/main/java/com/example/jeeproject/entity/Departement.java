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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public List<Enseignant> getEnseignants() {
		return enseignants;
	}

	public void setEnseignants(List<Enseignant> enseignants) {
		this.enseignants = enseignants;
	}

	public List<Option> getOptions() {
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

}