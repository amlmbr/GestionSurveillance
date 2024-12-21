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

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isEstDispense() {
		return estDispense;
	}

	public void setEstDispense(boolean estDispense) {
		this.estDispense = estDispense;
	}

	public int getNbSurveillances() {
		return nbSurveillances;
	}

	public void setNbSurveillances(int nbSurveillances) {
		this.nbSurveillances = nbSurveillances;
	}

	public boolean isEstReserviste() {
		return estReserviste;
	}

	public void setEstReserviste(boolean estReserviste) {
		this.estReserviste = estReserviste;
	}

	public Departement getDepartement() {
		return departement;
	}

	public void setDepartement(Departement departement) {
		this.departement = departement;
	}

	public List<Module> getModulesResponsables() {
		return modulesResponsables;
	}

	public void setModulesResponsables(List<Module> modulesResponsables) {
		this.modulesResponsables = modulesResponsables;
	}
	

}