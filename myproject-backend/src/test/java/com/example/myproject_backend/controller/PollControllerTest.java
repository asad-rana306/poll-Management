package com.example.myproject_backend.controller;

import com.example.myproject_backend.DTO.Request.*;
import com.example.myproject_backend.DTO.Response.*;
import com.example.myproject_backend.entity.Poll;
import com.example.myproject_backend.service.PollService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PollControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PollService pollService;

    @InjectMocks
    private PollController controller;

    private Principal principal;
    ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        principal = new Principal() {
            @Override
            public String getName() {
                return "testUser";
            }
        };
    }

    @Test
    void testingbyCreatingPoll() throws Exception {
        CreatePollRequest req = new CreatePollRequest();
        req.setTitle("test poll");

        when(pollService.createPoll(any(), anyString())).thenReturn(new Poll());

        mockMvc.perform(post("/api/poll/create-poll")
                        .contentType(MediaType.APPLICATION_JSON)
                        .principal(principal)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
    @Test
    void invitingUsertest() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("username", "john");

        doNothing().when(pollService).inviteUser(eq(1L), eq("john"), eq("testUser"));

        mockMvc.perform(post("/api/poll/1/invite")
                        .contentType(MediaType.APPLICATION_JSON)
                        .principal(principal)
                        .content(mapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }
    @Test
    public void testingBydeletingPoll() throws Exception {
        doNothing().when(pollService).deletePoll(1L, "testUser");
        mockMvc.perform(delete("/api/poll/1")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void finishingThePollTest() throws Exception {
        mockMvc.perform(put("/api/poll/2/finish")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void checkingDashboardSummaryDetails() throws Exception {
        List<CreatedPollResponseDto> list = new ArrayList<>();
        when(pollService.getCreatedPolls("testUser")).thenReturn(list);

        mockMvc.perform(get("/api/poll/created")
                        .principal(principal))
                .andExpect(status().isOk());

    }
    @Test
    void getCreatedpolltest() throws Exception {
        List<CreatedPollResponseDto> list = new ArrayList<>();
        when(pollService.getCreatedPolls("testUser")).thenReturn(list);

        mockMvc.perform(get("/api/poll/created")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void GettingThePollDataByUserIdandName() throws Exception {
        FullPollResponseDto dto = new FullPollResponseDto(1L, "title", "desc", new ArrayList<>());
        when(pollService.getPollWithQuestions(1L, "Alex")).thenReturn(dto);

        mockMvc.perform(get("/api/poll/2")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void getResultofAPoll() throws Exception {
        when(pollService.getPollResults(1L, "testUser")).thenReturn(new HashMap<>());
        mockMvc.perform(get("/api/poll/1/results")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void EditingTheExitingPollTest() throws Exception {
        UpdatePollRequest u = new UpdatePollRequest();
        u.setTitle("updated");
        mockMvc.perform(put("/api/poll/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .principal(principal)
                        .content(mapper.writeValueAsString(u)))
                .andExpect(status().isOk());
    }
    @Test
    void verifyingTitleCheckApi() throws Exception {
        when(pollService.getPollResults(2L, "testUser")).thenReturn(new HashMap<>());

        mockMvc.perform(get("/api/poll/2/results")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void TestingPendingPollAPI() throws Exception {
        when(pollService.getPendingPolls("testUser")).thenReturn(new ArrayList<>());
        mockMvc.perform(get("/api/poll/pending")
                        .principal(principal))
                .andExpect(status().isOk());
    }
    @Test
    void TestingBYSubmitingTheAnswers() throws Exception {
        SubmitPollRequest s = new SubmitPollRequest();
        s.setAnswer(new ArrayList<>());

        mockMvc.perform(post("/api/poll/1/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .principal(principal)
                        .content(mapper.writeValueAsString(s)))
                .andExpect(status().isOk());
    }
    @Test
    void testingAllAvailablePollsApi() throws Exception {
        when(pollService.getPendingPolls("ALex")).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/api/poll/pending")
                        .principal(principal))
                .andExpect(status().isOk());
    }
}