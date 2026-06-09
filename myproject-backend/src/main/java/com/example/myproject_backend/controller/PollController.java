package com.example.myproject_backend.controller;

import com.example.myproject_backend.DTO.Request.CreatePollRequest;
import com.example.myproject_backend.DTO.Request.SubmitPollRequest;
import com.example.myproject_backend.DTO.Request.UpdatePollRequest;
import com.example.myproject_backend.DTO.Response.CreatedPollResponseDto;
import com.example.myproject_backend.DTO.Response.FullPollResponseDto;
import com.example.myproject_backend.DTO.Response.PendingPollResponse;
import com.example.myproject_backend.entity.Poll;
import com.example.myproject_backend.service.PollService;

import com.example.myproject_backend.service.UserDetailsServices;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/poll")
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping("/create-poll")
    public ResponseEntity<?> createPoll(@RequestBody CreatePollRequest PollRequest, Principal principal){
        Poll poll = pollService.createPoll(PollRequest, principal.getName());
        return ResponseEntity.ok(200);
    }

    @PostMapping("/{pollId}/invite")
    public ResponseEntity<?> inviteUser(@PathVariable Long pollId, @RequestBody Map<String, String> payload, Principal principal) {
        String invitedPersonUsername = payload.get("username");
        String OwnerUsername = principal.getName();
        log.info("The owner name got extracted" + OwnerUsername);
        pollService.inviteUser(pollId, invitedPersonUsername, OwnerUsername);

        return ResponseEntity.ok(200);
    }

    @DeleteMapping("/{pollId}")
    public ResponseEntity<?> deletePoll(@PathVariable Long pollId, Principal principal) {
        pollService.deletePoll(pollId, principal.getName());
        log.info("Poll deleted with the id" + pollId);
        return ResponseEntity.ok(200);
    }

    @PutMapping("/{pollId}/finish")
    public ResponseEntity<?> finishPoll(@PathVariable Long pollId, Principal principal) {
        pollService.finishPoll(pollId, principal.getName());
        log.info("Poll with the id: "+pollId + "is finished");
        return ResponseEntity.ok(200);
    }

    @PutMapping("/{pollId}")
    public ResponseEntity<?> updatePoll(@PathVariable Long pollId, @RequestBody UpdatePollRequest updationrequest, Principal principal) {

        pollService.updatePoll(pollId, updationrequest, principal.getName());
        log.info("the Poll is updated");
        return ResponseEntity.ok(200);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingPollResponse>> getPendingPolls(Principal principal) {
        List<PendingPollResponse> pendingPolls = pollService.getPendingPolls(principal.getName());
        log.info("All Pending polls are fetched");
        return ResponseEntity.ok(pendingPolls);
    }

    @PostMapping("/{pollId}/submit")
    public ResponseEntity<?> submitPollResponse(@PathVariable Long pollId, @RequestBody SubmitPollRequest submissionRequest, Principal principal) {

        pollService.submitPollResponse(pollId, submissionRequest, principal.getName());
        log.info("Poll Answer is Submitted");
        return ResponseEntity.ok(200);
    }

    @GetMapping("/created")
    public ResponseEntity<List<CreatedPollResponseDto>> getCreatedPolls(Principal principal) {
        List<CreatedPollResponseDto> myPolls = pollService.getCreatedPolls(principal.getName());
        log.info("User created poll are fetched");
        return ResponseEntity.ok(myPolls);
    }

    @GetMapping("/{pollId}")
    public ResponseEntity<FullPollResponseDto> getPollDetails(@PathVariable Long pollId, Principal principal) {
        FullPollResponseDto pollDetails = pollService.getPollWithQuestions(pollId, principal.getName());
        log.info("poll with the id: "+pollId+"is fetched");
        return ResponseEntity.ok(pollDetails);
    }
}
