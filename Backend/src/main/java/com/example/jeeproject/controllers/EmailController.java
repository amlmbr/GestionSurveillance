package com.example.jeeproject.controllers;

import com.example.jeeproject.dto.EmailRequest;
import com.example.jeeproject.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendEmail(
                emailRequest.getTo(),
                emailRequest.getSubject(),
                emailRequest.getText()
        );
        return "Email sent successfully";
    }
}