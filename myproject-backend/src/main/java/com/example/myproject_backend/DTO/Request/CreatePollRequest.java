package com.example.myproject_backend.DTO.Request;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreatePollRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private List<QuestionRequest> questions;
    private boolean anonymous;

}
