package com.example.myproject_backend.controller;

import com.example.myproject_backend.DTO.Request.CreatePollRequest;
import com.example.myproject_backend.DTO.Request.SubmitPollRequest;
import com.example.myproject_backend.DTO.Request.UpdatePollRequest;
import com.example.myproject_backend.DTO.Response.CreatedPollResponseDto;
import com.example.myproject_backend.DTO.Response.FullPollResponseDto;
import com.example.myproject_backend.DTO.Response.PendingPollResponse;
import com.example.myproject_backend.entity.Poll;
import com.example.myproject_backend.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/poll")
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping("/create-poll")
    public ResponseEntity<?> createPoll(@RequestBody CreatePollRequest createPollRequest, Principal principal){
        Poll poll = pollService.createPoll(createPollRequest, principal.getName());
        return ResponseEntity.ok(Map.of("Message", "Poll is Created"));
    }

    @PostMapping("/{pollId}/invite")
    public ResponseEntity<?> inviteUser(@PathVariable Long pollId, @RequestBody Map<String, String> payload, Principal principal) {
        String inviteeUsername = payload.get("username");
        String requesterUsername = principal.getName();
        pollService.inviteUser(pollId, inviteeUsername, requesterUsername);

        return ResponseEntity.ok(Map.of("message", "User invited successfully"));
    }

    @DeleteMapping("/{pollId}")
    public ResponseEntity<?> deletePoll(@PathVariable Long pollId, Principal principal) {
        pollService.deletePoll(pollId, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Poll deleted successfully"));
    }

    @PutMapping("/{pollId}/finish")
    public ResponseEntity<?> finishPoll(@PathVariable Long pollId, Principal principal) {
        pollService.finishPoll(pollId, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Poll has been marked as finished"));
    }

    @PutMapping("/{pollId}")
    public ResponseEntity<?> updatePoll(@PathVariable Long pollId, @RequestBody UpdatePollRequest request, Principal principal) {

        pollService.updatePoll(pollId, request, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Poll updated successfully"));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingPollResponse>> getPendingPolls(Principal principal) {
        List<PendingPollResponse> pendingPolls = pollService.getPendingPolls(principal.getName());
        return ResponseEntity.ok(pendingPolls);
    }

    @PostMapping("/{pollId}/submit")
    public ResponseEntity<?> submitPollResponse(@PathVariable Long pollId, @RequestBody SubmitPollRequest request, Principal principal) {

        pollService.submitPollResponse(pollId, request, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Poll submitted successfully"));
    }

    @GetMapping("/created")
    public ResponseEntity<List<CreatedPollResponseDto>> getCreatedPolls(Principal principal) {
        List<CreatedPollResponseDto> myPolls = pollService.getCreatedPolls(principal.getName());
        return ResponseEntity.ok(myPolls);
    }

    @GetMapping("/{pollId}")
    public ResponseEntity<FullPollResponseDto> getPollDetails(@PathVariable Long pollId, Principal principal) {
        FullPollResponseDto pollDetails = pollService.getPollWithQuestions(pollId, principal.getName());
        return ResponseEntity.ok(pollDetails);
    }
}
