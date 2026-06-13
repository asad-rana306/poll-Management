package com.example.myproject_backend.DTO.Request;

import com.example.myproject_backend.Enum.QuestionType;
import com.example.myproject_backend.entity.Question;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdatePollRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private List<Question> questions;
    private String text;
    private QuestionType type;
}
