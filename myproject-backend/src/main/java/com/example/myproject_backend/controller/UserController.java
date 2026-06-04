package com.example.myproject_backend.controller;

import com.example.myproject_backend.DTO.Response.UserResponseDto;
import com.example.myproject_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers(Principal principal) {
        List<UserResponseDto> users = userService.getAllUsersExcept(principal.getName());
        return ResponseEntity.ok(users);
    }
}