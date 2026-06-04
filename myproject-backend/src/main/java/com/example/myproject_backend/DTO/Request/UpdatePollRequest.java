package com.example.myproject_backend.DTO.Request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdatePollRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
}
