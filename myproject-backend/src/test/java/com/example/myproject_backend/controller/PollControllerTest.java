package com.example.myproject_backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PollControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetPendingPolls_WithoutLogin_ReturnsUnauthorized() throws Exception {
        // here we are trying to access poll in which we are invited without login(no token pass)
        mockMvc.perform(get("/api/poll/pending"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "Alex_Test")
    void testGetPendingPolls_WithLogin_ReturnsOk() throws Exception {
        // and here we are trying to access with token (logged in user)
        mockMvc.perform(get("/api/poll/pending"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "Alex_Test")
    void testGetCreatedPolls_WithLogin_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/poll/created"))
                .andExpect(status().isOk());
    }
}