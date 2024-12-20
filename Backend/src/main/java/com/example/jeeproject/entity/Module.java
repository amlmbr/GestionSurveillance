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

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false) // Chaque module a un responsable
    //@JsonManagedReference("module-enseignant")
    @JsonBackReference("module-enseignant")  // Changé en JsonBackReference
    private Enseignant responsable;


    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false) // Chaque module appartient à une option
    //@JsonManagedReference("module-option")
    @JsonBackReference("module-option")  // Changé en JsonBackReference
    private Option option;
}
