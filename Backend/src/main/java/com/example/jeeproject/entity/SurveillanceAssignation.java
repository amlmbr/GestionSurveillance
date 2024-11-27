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
    
    private String typeSurveillant;// PRINCIPAL ou RESERVISTE
    
   

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

	public String getTypeSurveillant() {
		return typeSurveillant;
	}

	public void setTypeSurveillant(String typeSurveillant) {
		this.typeSurveillant = typeSurveillant;
	}
}