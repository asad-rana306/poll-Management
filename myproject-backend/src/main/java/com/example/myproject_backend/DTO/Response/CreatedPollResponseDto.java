package com.example.myproject_backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatedPollResponseDto {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private int numberOfQuestions;
    private boolean isFinished;
}
