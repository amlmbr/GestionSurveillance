package com.example.jeeproject.entity;

import java.util.ArrayList;
import java.util.Collection;

import com.example.jeeproject.sec.entity.AppRole;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveillanceAssignation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;
    
    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;
    
    @ManyToOne
    @JoinColumn(name = "local_id")
    private Local local;
    
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;
    
    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
    
    @ManyToOne
    @JoinColumn(name = "option_id")
    private Option option;
    
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
    
    private String typeSurveillant;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Examen getExamen() {
		return examen;
	}

	public void setExamen(Examen examen) {
		this.examen = examen;
	}

	public Enseignant getEnseignant() {
		return enseignant;
	}

	public void setEnseignant(Enseignant enseignant) {
		this.enseignant = enseignant;
	}

	public Local getLocal() {
		return local;
	}

	public void setLocal(Local local) {
		this.local = local;
	}

	public Departement getDepartement() {
		return departement;
	}

	public void setDepartement(Departement departement) {
		this.departement = departement;
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public Option getOption() {
		return option;
	}

	public void setOption(Option option) {
		this.option = option;
	}

	public Module getModule() {
		return module;
	}

	public void setModule(Module module) {
		this.module = module;
	}

	public String getTypeSurveillant() {
		return typeSurveillant;
	}

	public void setTypeSurveillant(String typeSurveillant) {
		this.typeSurveillant = typeSurveillant;
	}
    
    
    
    

    // Ajoutez les getters et setters pour les nouveaux champs
}