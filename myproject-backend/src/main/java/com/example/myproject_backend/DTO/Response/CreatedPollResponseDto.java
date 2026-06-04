package com.example.myproject_backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
public class CreatedPollResponseDto {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private int numberOfQuestions;
    private boolean isFinished;
}
