package com.example.myproject_backend.service;

import com.example.myproject_backend.DTO.Response.UserResponseDto;
import com.example.myproject_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponseDto> getAllUsersExcept(String currentUsername) {
        return userRepository.findAll().stream()
                // Filter out the person currently logged in
                .filter(user -> !user.getUsername().equals(currentUsername))
                // Convert the remaining users to safe DTOs (no passwords)
                .map(user -> new UserResponseDto(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
    }
}