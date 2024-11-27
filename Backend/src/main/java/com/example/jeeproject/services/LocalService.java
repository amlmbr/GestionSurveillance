package com.example.jeeproject.services;


import com.example.jeeproject.entity.Local;

import java.util.List;

public interface LocalService {
    List<Local> getAllLocaux();
    Local getLocalById(Long id);
    Local createLocal(Local local);
    Local updateLocal(Long id, Local local);
    void deleteLocal(Long id);
}