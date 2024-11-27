package com.example.jeeproject.sec.controller;

import com.example.jeeproject.sec.entity.AppUser;
import com.example.jeeproject.sec.services.AccountService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
public class AccountRestController {
    private AccountService accountService;

    public AccountRestController(AccountService accountService) {
        this.accountService = accountService;
    }
    @GetMapping("/users")
    public List<AppUser> appUsers(){
        return accountService.getUsers();
    }
    @PostMapping("/user")
    public AppUser addUser(@RequestBody AppUser user){
        return accountService.addNewAccount(user);
    }
    @PutMapping("/userupdate")
    public AppUser updateUser(@RequestBody AppUser user){
        return accountService.updatePassword(user.getEmail(),user.getPassword());

    }
    @GetMapping("/profil")
    public AppUser profile(Principal principal){
        return accountService.loadUserByUsername(principal.getName());
    }
}
