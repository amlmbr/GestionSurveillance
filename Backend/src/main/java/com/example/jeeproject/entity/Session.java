package com.example.jeeproject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String typeSession;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String start1;
    private String end1;
    private String start2;
    private String end2;
    private String start3;
    private String end3;
    private String start4;
    private String end4;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTypeSession() {
		return typeSession;
	}
	public void setTypeSession(String typeSession) {
		this.typeSession = typeSession;
	}
	public LocalDate getDateDebut() {
		return dateDebut;
	}
	public void setDateDebut(LocalDate dateDebut) {
		this.dateDebut = dateDebut;
	}
	public LocalDate getDateFin() {
		return dateFin;
	}
	public void setDateFin(LocalDate dateFin) {
		this.dateFin = dateFin;
	}
	public String getStart1() {
		return start1;
	}
	public void setStart1(String start1) {
		this.start1 = start1;
	}
	public String getEnd1() {
		return end1;
	}
	public void setEnd1(String end1) {
		this.end1 = end1;
	}
	public String getStart2() {
		return start2;
	}
	public void setStart2(String start2) {
		this.start2 = start2;
	}
	public String getEnd2() {
		return end2;
	}
	public void setEnd2(String end2) {
		this.end2 = end2;
	}
	public String getStart3() {
		return start3;
	}
	public void setStart3(String start3) {
		this.start3 = start3;
	}
	public String getEnd3() {
		return end3;
	}
	public void setEnd3(String end3) {
		this.end3 = end3;
	}
	public String getStart4() {
		return start4;
	}
	public void setStart4(String start4) {
		this.start4 = start4;
	}
	public String getEnd4() {
		return end4;
	}
	public void setEnd4(String end4) {
		this.end4 = end4;
	}
    
}
