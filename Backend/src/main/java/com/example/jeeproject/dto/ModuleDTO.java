// ModuleDTO.java
package com.example.jeeproject.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDTO {
    private Long id;
    private String nom;
    private String responsableNom;
    private String optionNom;
}