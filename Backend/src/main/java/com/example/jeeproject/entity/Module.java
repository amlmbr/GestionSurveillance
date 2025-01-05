package com.example.jeeproject.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du module est obligatoire")
    private String nom;

    @ManyToOne(optional = true)
    @JoinColumn(name = "enseignant_id", nullable = false) // Chaque module a un responsable
    //@JsonManagedReference("module-enseignant")
    @JsonBackReference("module-enseignant")  // Changé en JsonBackReference
    private Enseignant responsable;


    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false) // Chaque module appartient à une option
    //@JsonManagedReference("module-option")
    @JsonBackReference("module-option")  // Changé en JsonBackReference
    private Option option;


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


	public Enseignant getResponsable() {
		return responsable;
	}


	public void setResponsable(Enseignant responsable) {
		this.responsable = responsable;
	}


	public Option getOption() {
		return option;
	}


	public void setOption(Option option) {
		this.option = option;
	}
    
    
    
}
