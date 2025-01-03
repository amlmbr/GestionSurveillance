package com.example.jeeproject.entity;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;


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

    private LocalDate date;
    private String horaire; // ex: "start1-end1"
    private int nbEtudiants;
    
    
    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false) // Chaque module appartient à une option
    private Option option;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module moduleExamen;

    
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

	public Option getOption() {
		return option;
	}

	public void setOption(Option option) {
		this.option = option;
	}

	public Module getModuleExamen() {
		return moduleExamen;
	}

	public void setModuleExamen(Module moduleExamen) {
		this.moduleExamen = moduleExamen;
	}

	
	
    
}
