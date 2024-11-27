package com.example.jeeproject.entity;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;
import java.time.LocalDate;

@Entity
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Session session;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;


    @ManyToOne
    private Enseignant enseignant;


    private String module;
    private LocalDate date;
    private String horaire; // ex: "start1-end1"
    private int nbEtudiants;
    
    
    @ManyToMany 
    @JoinTable(
        name = "examen_locaux",
        joinColumns = @JoinColumn(name = "examen_id"),
        inverseJoinColumns = @JoinColumn(name = "local_id")
    )
    private Set<Local> locaux = new HashSet<>(); // Remplacer le champ local par locaux

    // Remplacer les getters/setters pour local par ceux pour locaux
    public Set<Local> getLocaux() {
        return locaux;
    }

    public void setLocaux(Set<Local> locaux) {
        this.locaux = locaux;
    }
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Session getSession() {
		return session;
	}
	public void setSession(Session session) {
		this.session = session;
	}
	public Departement getDepartement() {
		return departement;
	}
	public void setDepartement(Departement departement) {
		this.departement = departement;
	}
	public Enseignant getEnseignant() {
		return enseignant;
	}
	public void setEnseignant(Enseignant enseignant) {
		this.enseignant = enseignant;
	}
	
	public String getModule() {
		return module;
	}
	public void setModule(String module) {
		this.module = module;
	}
	public LocalDate getDate() {
		return date;
	}
	public void setDate(LocalDate date) {
		this.date = date;
	}
	public String getHoraire() {
		return horaire;
	}
	public void setHoraire(String horaire) {
		this.horaire = horaire;
	}
	public int getNbEtudiants() {
		return nbEtudiants;
	}
	public void setNbEtudiants(int nbEtudiants) {
		this.nbEtudiants = nbEtudiants;
	}

	
	
    
}
