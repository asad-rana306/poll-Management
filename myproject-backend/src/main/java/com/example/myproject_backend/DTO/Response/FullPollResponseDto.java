package com.example.myproject_backend.DTO.Response;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FullPollResponseDto {
    private Long id;
    private String title;
    private String description;
    private List<QuestionDto> questions;
}
