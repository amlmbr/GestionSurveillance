package com.example.jeeproject.controllers;

import com.example.jeeproject.entity.Student;
import com.example.jeeproject.services.StudentScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentScheduleController {

    @Autowired
    private StudentScheduleService studentScheduleService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentScheduleService.getAllStudents());
    }

    @PostMapping("/import/{sessionId}")
    public ResponseEntity<?> importStudents(@RequestParam("file") MultipartFile file,
                                          @PathVariable Long sessionId) {
        try {
            List<Student> importedStudents = studentScheduleService.importStudentsFromFile(file, sessionId);
            return ResponseEntity.ok().body(Map.of(
                "message", "Import réussi",
                "count", importedStudents.size(),
                "students", importedStudents
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Erreur lors de l'import",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/option/{optionId}")
    public ResponseEntity<List<Student>> getStudentsByOption(@PathVariable Long optionId) {
        return ResponseEntity.ok(studentScheduleService.getStudentsByOption(optionId));
    }
}