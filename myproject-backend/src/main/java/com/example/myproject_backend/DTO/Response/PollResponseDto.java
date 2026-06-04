package com.example.myproject_backend.DTO.Response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PollResponseDto {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private int numberOfQuesetion;
}
