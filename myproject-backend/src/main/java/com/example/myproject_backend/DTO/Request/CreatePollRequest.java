package com.example.myproject_backend.DTO.Request;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreatePollRequest {
    private String title;
    private String descriptioin;
    private LocalDate dueDate;
    private List<QuestionRequest> questions;

}
