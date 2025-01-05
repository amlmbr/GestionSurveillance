// OptionDTO.java
package com.example.jeeproject.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptionDTO {
    private Long id;
    private String nom;
    private String departementNom;
}