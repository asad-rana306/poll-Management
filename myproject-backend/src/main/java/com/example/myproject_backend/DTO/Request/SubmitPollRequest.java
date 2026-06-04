package com.example.myproject_backend.DTO.Request;

import com.example.myproject_backend.DTO.Response.AnswerResponse;
import lombok.Data;

import java.util.List;

@Data
public class SubmitPollRequest {
    private List<AnswerResponse> answer;
}
