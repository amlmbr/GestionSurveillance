package com.example.jeeproject.dto;

public class StatisticsDto {
    private long salles;
    private long enseignants;
    private long departements;
    private long examens;
    // Constructeur
    public StatisticsDto(long salles, long enseignants, long departements, long examens) {
        this.salles = salles;
        this.enseignants = enseignants;
        this.departements = departements;
        this.examens = examens;
    }
    public long getSalles() {
        return salles;
    }
    public void setSalles(long salles) {
        this.salles = salles;
    }
    public long getEnseignants() {
        return enseignants;
    }
    public void setEnseignants(long enseignants) {
        this.enseignants = enseignants;
    }
    public long getDepartements() {
        return departements;
    }
    public void setDepartements(long departements) {
        this.departements = departements;
    }
    public long getExamens() {
        return examens;
    }
    public void setExamens(long examens) {
        this.examens = examens;
    }
}