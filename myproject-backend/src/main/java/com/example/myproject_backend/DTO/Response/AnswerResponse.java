package com.example.myproject_backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AnswerResponse {
    public Long questionId;
    private String value;

}
