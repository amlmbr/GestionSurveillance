package com.example.jeeproject.sec.services;

import com.example.jeeproject.sec.entity.AppRole;
import com.example.jeeproject.sec.entity.AppUser;

import java.util.List;

public interface AccountService {
    AppUser addNewAccount(AppUser user);
    AppRole addNewRole(AppRole role);
    void addRoleToUser(String username, String role);
    AppUser loadUserByUsername(String username);
    AppUser loadUserByEmail(String email);
    AppUser updatePassword(String username, String newPassword);
    List<AppUser> getUsers();
}
