package com.example.jeeproject.controllers;

import com.example.jeeproject.dto.StatisticsDto;
import com.example.jeeproject.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class StatisticsController {
    @Autowired
    private StatisticsService statisticsService;
    @GetMapping("/statistics/{sessionId}")
    public StatisticsDto getStatistics(@PathVariable Long sessionId) {
        return statisticsService.getStatistics(sessionId);
    }
}