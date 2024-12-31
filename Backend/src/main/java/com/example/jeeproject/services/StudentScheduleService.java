package com.example.jeeproject.services;

import com.example.jeeproject.entity.Option;
import com.example.jeeproject.entity.Student;
import com.example.jeeproject.repo.OptionRepository;
import com.example.jeeproject.repo.StudentRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class StudentScheduleService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private OptionRepository optionRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> importStudentsFromFile(MultipartFile file, Long sessionId) throws IOException {
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            throw new IOException("Nom de fichier invalide");
        }

        if (fileName.endsWith(".csv")) {
            return importStudentsFromCsv(file);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            return importStudentsFromExcel(file);
        } else {
            throw new IOException("Format de fichier non supporté. Utilisez CSV ou Excel (.xlsx/.xls)");
        }
    }

    private List<Student> importStudentsFromCsv(MultipartFile file) throws IOException {
        List<Student> importedStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT
                     .withFirstRecordAsHeader()
                     .withIgnoreHeaderCase()
                     .withTrim())) {

            for (CSVRecord csvRecord : csvParser) {
                try {
                    String optionName = csvRecord.get("option");
                    Option option = optionRepository.findOptionByNom(optionName);
                    
                    if (option == null) {
                        throw new RuntimeException("L'option '" + optionName + "' n'existe pas pour l'étudiant: " + 
                            csvRecord.get("nom") + " " + csvRecord.get("prenom"));
                    }

                    Student student = new Student();
                    student.setNom(csvRecord.get("nom"));
                    student.setPrenom(csvRecord.get("prenom"));
                    student.setCin(csvRecord.get("cin"));
                    student.setCne(csvRecord.get("cne"));
                    student.setOption(option);

                    importedStudents.add(studentRepository.save(student));
                } catch (Exception e) {
                    errors.add(e.getMessage());
                }
            }
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException("Erreurs lors de l'import: " + String.join(", ", errors));
        }

        return importedStudents;
    }

    private List<Student> importStudentsFromExcel(MultipartFile file) throws IOException {
        List<Student> importedStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        Workbook workbook;

        if (file.getOriginalFilename().endsWith(".xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else {
            workbook = new HSSFWorkbook(file.getInputStream());
        }

        Sheet sheet = workbook.getSheetAt(0);
        Row headerRow = sheet.getRow(0);
        
        // Vérifier les colonnes requises
        int nomIdx = findColumnIndex(headerRow, "nom");
        int prenomIdx = findColumnIndex(headerRow, "prenom");
        int cinIdx = findColumnIndex(headerRow, "cin");
        int cneIdx = findColumnIndex(headerRow, "cne");
        int optionIdx = findColumnIndex(headerRow, "option");

        if (nomIdx == -1 || prenomIdx == -1 || cinIdx == -1 || cneIdx == -1 || optionIdx == -1) {
            throw new IOException("Le fichier Excel doit contenir les colonnes: nom, prenom, cin, cne, option");
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row != null) {
                try {
                    String optionName = getCellValueAsString(row.getCell(optionIdx));
                    Option option = optionRepository.findOptionByNom(optionName);
                    
                    if (option == null) {
                        throw new RuntimeException("L'option '" + optionName + "' n'existe pas pour l'étudiant: " + 
                            getCellValueAsString(row.getCell(nomIdx)) + " " + 
                            getCellValueAsString(row.getCell(prenomIdx)));
                    }

                    Student student = new Student();
                    student.setNom(getCellValueAsString(row.getCell(nomIdx)));
                    student.setPrenom(getCellValueAsString(row.getCell(prenomIdx)));
                    student.setCin(getCellValueAsString(row.getCell(cinIdx)));
                    student.setCne(getCellValueAsString(row.getCell(cneIdx)));
                    student.setOption(option);

                    importedStudents.add(studentRepository.save(student));
                } catch (Exception e) {
                    errors.add("Ligne " + (i + 1) + ": " + e.getMessage());
                }
            }
        }

        workbook.close();

        if (!errors.isEmpty()) {
            throw new RuntimeException("Erreurs lors de l'import: " + String.join(", ", errors));
        }

        return importedStudents;
    }

    private int findColumnIndex(Row headerRow, String columnName) {
        for (int i = 0; i < headerRow.getLastCellNum(); i++) {
            Cell cell = headerRow.getCell(i);
            if (cell != null && columnName.equalsIgnoreCase(getCellValueAsString(cell))) {
                return i;
            }
        }
        return -1;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    public List<Student> getStudentsByOption(Long optionId) {
        return studentRepository.findByOptionId(optionId);
    }
}