package com.example.myproject_backend.DTO.Request;

import java.time.LocalDate;

public class CreatePoll {
    private String title;
    private String descriptioin;
    private LocalDate dueDate;
    private List<QuestionRequest> questions;
}
