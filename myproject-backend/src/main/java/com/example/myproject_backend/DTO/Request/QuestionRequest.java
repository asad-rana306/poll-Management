package com.example.myproject_backend.DTO.Request;

import lombok.Data;

@Data
public class QuestionRequest {
    private String text;
    private String type;
}
