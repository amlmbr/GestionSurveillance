package com.example.jeeproject.dto;

public class AssignSurveillantRequest {
    private Long examenId;
    private Long enseignantId;
    private Long localId;
    private String typeSurveillant;
    private Long departementId;
    private Long sessionId;
    private Long optionId;
    private Long moduleId;

    // Constructeur par défaut
    public AssignSurveillantRequest() {}

    // Constructeur avec tous les paramètres
    public AssignSurveillantRequest(Long examenId, Long enseignantId, Long localId, 
            String typeSurveillant, Long departementId, Long sessionId, 
            Long optionId, Long moduleId) {
        this.examenId = examenId;
        this.enseignantId = enseignantId;
        this.localId = localId;
        this.typeSurveillant = typeSurveillant;
        this.departementId = departementId;
        this.sessionId = sessionId;
        this.optionId = optionId;
        this.moduleId = moduleId;
    }

    // Ajoutez les getters et setters pour les nouveaux champs
    public Long getDepartementId() {
        return departementId;
    }

    public void setDepartementId(Long departementId) {
        this.departementId = departementId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

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
    

    // Les autres getters et setters existants restent inchangés
}