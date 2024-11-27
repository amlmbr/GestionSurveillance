package com.example.jeeproject.dto;

public class AssignSurveillantRequest {
    // Utilisez des types primitifs ou des objets simples
    private Long examenId;
    private Long enseignantId;
    private Long localId;
    private String typeSurveillant;

    // Constructeurs
    public AssignSurveillantRequest() {}

    public AssignSurveillantRequest(Long examenId, Long enseignantId, Long localId, String typeSurveillant) {
        this.examenId = examenId;
        this.enseignantId = enseignantId;
        this.localId = localId;
        this.typeSurveillant = typeSurveillant;
    }

    // Getters et setters standard
    public Long getExamenId() {
        return examenId;
    }

    public void setExamenId(Long examenId) {
        this.examenId = examenId;
    }

    public Long getEnseignantId() {
        return enseignantId;
    }

    public void setEnseignantId(Long enseignantId) {
        this.enseignantId = enseignantId;
    }

    public Long getLocalId() {
        return localId;
    }

    public void setLocalId(Long localId) {
        this.localId = localId;
    }

    public String getTypeSurveillant() {
        return typeSurveillant;
    }

    public void setTypeSurveillant(String typeSurveillant) {
        this.typeSurveillant = typeSurveillant;
    }
}