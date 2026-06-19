package com.example.myproject_backend.service;

import com.example.myproject_backend.DTO.Request.CreatePollRequest;
import com.example.myproject_backend.DTO.Request.SubmitPollRequest;
import com.example.myproject_backend.DTO.Request.UpdatePollRequest;
import com.example.myproject_backend.DTO.Response.CreatedPollResponseDto;
import com.example.myproject_backend.DTO.Response.FullPollResponseDto;
import com.example.myproject_backend.DTO.Response.PendingPollResponse;
import com.example.myproject_backend.DTO.Response.QuestionDto;
import com.example.myproject_backend.Enum.QuestionType;
import com.example.myproject_backend.entity.*;
import com.example.myproject_backend.repository.PollRepository;
import com.example.myproject_backend.repository.QuestionRepository;
import com.example.myproject_backend.repository.ResponseRepository;
import com.example.myproject_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PollService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PollRepository pollRepository;
    @Autowired
    private ResponseRepository responseRepository;
    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public Poll createPoll(CreatePollRequest createPollRequest, String userName) {
        if(pollRepository.existsByTitle(createPollRequest.getTitle())) {
            throw new RuntimeException("Poll title already exist change it kindly");
        }
        User owner = userRepository.findByUsername(userName).orElseThrow(
                ()-> new RuntimeException("User not found with userName"));
        Poll poll = new Poll();
        poll.setTitle(createPollRequest.getTitle());
        poll.setPollOwner(owner);
        poll.setOwnerName(owner.getUsername());
        poll.setDescription(createPollRequest.getDescription());
        poll.setDueDate(createPollRequest.getDueDate());
        poll.setFinished(false);
        poll.setAnonymous(createPollRequest.isAnonymous());
        List<Question> questions = createPollRequest.getQuestions().stream().map(questionRequest->{
            Question ques = new Question();
            ques.setText(questionRequest.getText());
            ques.setType(QuestionType.valueOf(questionRequest.getType()));
            ques.setPoll(poll);
            return ques;
        }).collect(Collectors.toList());
        poll.setQuestions(questions);
        return pollRepository.save(poll);
    }

    @Transactional
    public void inviteUser(Long pollId, String inviteName, String requesterUsername) {
        if (inviteName.equals(requesterUsername)) {
            throw new RuntimeException("You cannot invite yourself to a poll");
        }
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("only owner can invite");
        }
        User invitee = userRepository.findByUsername(inviteName)
                .orElseThrow(() -> new RuntimeException("User to invite not found"));

        if (!poll.getInvitees().contains(invitee)) {
            poll.getInvitees().add(invitee);
            pollRepository.save(poll);
        }
    }

    @Transactional
    public void deletePoll(Long pollId, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can delete this poll");
        }
        List<PollResponse> responses = responseRepository.findByPollId(pollId);

        if (responses != null && !responses.isEmpty()) {
            responseRepository.deleteAll(responses);
            responseRepository.flush();
        }
        pollRepository.delete(poll);
    }

    @Transactional
    public void finishPoll(Long pollId, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can finish this poll");
        }

        poll.setFinished(true);
        pollRepository.save(poll);
    }

    @Transactional
    public Poll updatePoll(Long pollId, UpdatePollRequest request, String requesterUsername) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(requesterUsername)) {
            throw new RuntimeException("Only the creator can update this poll");
        }
        if (!poll.getTitle().equals(request.getTitle()) && pollRepository.existsByTitle(request.getTitle())) {
            throw new RuntimeException("Poll title already exists, kindly change it");
        }

        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setDueDate(request.getDueDate());

        if (request.getQuestions() != null) {
            poll.getQuestions().clear();

            List<Question> updatedQuestions = request.getQuestions().stream().map(questionRequest -> {
                Question ques = new Question();
                ques.setText(questionRequest.getText());
                ques.setType(QuestionType.valueOf(String.valueOf(questionRequest.getType())));
                ques.setPoll(poll);
                return ques;
            }).collect(Collectors.toList());

            poll.getQuestions().addAll(updatedQuestions);
        }

        return pollRepository.save(poll);
    }

    public List<PendingPollResponse> getPendingPolls(String username) {

        List<Poll> allInvitedPolls = pollRepository.findByInviteesUsernameOrderByDueDateDesc(username);
        List<PollResponse> userResponses = responseRepository.findByUserUsername(username);
        List<Long> answeredPollIds = new ArrayList<>();
        for (PollResponse response : userResponses) {
            answeredPollIds.add(response.getPoll().getId());
        }
        List<Poll> pendingPolls = new ArrayList<>();
        for (Poll poll : allInvitedPolls) {
            if (!answeredPollIds.contains(poll.getId())) {
                pendingPolls.add(poll);
            }
        }
        List<PendingPollResponse> responseDtos = new ArrayList<>();
        for (Poll p : pendingPolls) {
            PendingPollResponse dto = new PendingPollResponse(
                    p.getId(),
                    p.getTitle(),
                    p.getDueDate(),
                    p.getQuestions().size()
            );
            responseDtos.add(dto);
        }

        return responseDtos;
    }

    @Transactional
    public void submitPollResponse(Long pollId, SubmitPollRequest submissionRequest, String username) {
        boolean userResponseded = responseRepository.existsByPollIdAndUserUsername(pollId, username);
        if (userResponseded) {
            log.info("user have already reponded with userName: " +username);
            throw new RuntimeException("user already responded");
        }
        Optional<Poll> poll = pollRepository.findById(pollId);
        if (!poll.isPresent()) {
            throw new RuntimeException("poll isn't found in the database ");
        }
        Poll poll1 = poll.get();

        if (poll1.isFinished()) {
            throw new RuntimeException("This poll has been finished and is no longer accepting answers.");
        }

        if (poll1.getDueDate() != null && LocalDate.now().isAfter(poll1.getDueDate())) {
            throw new RuntimeException("This poll has expired. The due date has passed.");
        }
        Optional<User> user = userRepository.findByUsername(username);

        if (!user.isPresent()) {
            throw new RuntimeException("credentials expired login again and then respond it");
        }

        User currentAppUser = user.get();

        List<User> invitedUser = poll1.getInvitees();
        if (invitedUser != null && !invitedUser.contains(currentAppUser)) {
            throw new RuntimeException("You are not invited to this poll");
        }

        if (submissionRequest.getAnswer().size() != poll1.getQuestions().size()) {
            throw new RuntimeException("please answer all the quesitons completely");
        }

        PollResponse response = new PollResponse();
        response.setPoll(poll1);
        response.setUser(currentAppUser);

        response.setResponderName(currentAppUser.getUsername());

        List<Answer> answer = new ArrayList<>();
        var answer1 = submissionRequest.getAnswer();

        if (answer1 != null) {
            for (int i =0; i < answer1.size(); i++) {
                var matchingAnswer = answer1.get(i);

                Optional<Question> question = questionRepository.findById(matchingAnswer.getQuestionId());
                if (!question.isPresent()) {
                    log.info("no question found: " + matchingAnswer.getQuestionId());
                    throw new RuntimeException("Question not found execption");
                }
                Question question1 = question.get();
                Answer aswerr = new Answer();
                aswerr.setQuestion(question1);
                aswerr.setResponderName(username);
                aswerr.setPollResponse(response);
                aswerr.setValue(matchingAnswer.getValue());
                answer.add(aswerr);
            }
        }
        response.setAnswers(answer);
        responseRepository.save(response);
        log.info("response submited successfully for id " +  pollId);
    }

    public List<CreatedPollResponseDto> getCreatedPolls(String username) {
        List<Poll> mypoll = pollRepository.findByPollOwnerUsernameOrderByDueDateDesc(username);
        if (mypoll == null || mypoll.isEmpty()) {
            log.info("no poll is created yet, please create the poll fisrt");
            return new ArrayList<>();
        }
        List<CreatedPollResponseDto> createdPoll = new ArrayList<>();
        log.info("poll found, wait fetching the polls");
        for (int i =0; i< mypoll.size();i++) {
            Poll currentPoll = mypoll.get(i);
            String title = currentPoll.getTitle();
            Long pollId = currentPoll.getId();
            LocalDate dueDate = currentPoll.getDueDate();
            int numOfQuestion = 0;
            if (currentPoll.getQuestions() != null) {
                numOfQuestion = currentPoll.getQuestions().size();
            }

            boolean solutionStatus = currentPoll.isFinished();
            CreatedPollResponseDto dto = new CreatedPollResponseDto(pollId, title,  dueDate, numOfQuestion, solutionStatus);
            createdPoll.add(dto);
        }
        log.info("All polls are fetched");
        return createdPoll;
    }

    public FullPollResponseDto getPollWithQuestions(Long pollId, String username) {
        Optional<Poll> existingPoll = pollRepository.findById(pollId);

        if (!existingPoll.isPresent()) {
            log.info("poll is not found" + pollId);
            throw new RuntimeException("Poll with the id:" + pollId + "do not exist in system");
        }

        log.info("Poll is extrated");
        Poll poll = existingPoll.get();

        List<Question> question = poll.getQuestions();
        List<QuestionDto> responseQuestion = new ArrayList<>();

        if (question != null) {
            for (int n = 0; n < question.size(); n++) {
                String s = "";
                Question q = question.get(n);
                String text = q.getText();
                Long questionId = q.getId();
                if (q.getType() != null) {
                    s = q.getType().name();
                }
                QuestionDto question1 = new QuestionDto(questionId,text, s);
                responseQuestion.add(question1);
            }
        }
        Long id = poll.getId();
        String descriptoin = poll.getDescription();
        String title = poll.getTitle();
        FullPollResponseDto fullResponse = new FullPollResponseDto(id,  title, descriptoin, responseQuestion);

        log.info("poll with id: "+pollId +" is fetched");
        return fullResponse;
    }

    public Map<String, Object> getPollResults(Long pollId, String username) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (!poll.getPollOwner().getUsername().equals(username)) {
            throw new RuntimeException("Only the owner can view these results");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", poll.getId());
        result.put("title", poll.getTitle());
        result.put("description", poll.getDescription());
        result.put("isFinished", poll.isFinished());
        result.put("anonymous", poll.isAnonymous());

        List<Map<String, Object>> questionsList = new ArrayList<>();
        for (Question q : poll.getQuestions()) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("text", q.getText());
            qMap.put("type", q.getType().name());
            questionsList.add(qMap);
        }
        result.put("questions", questionsList);

        List<PollResponse> responses = responseRepository.findByPollId(pollId);

        List<Map<String, Object>> participants = new ArrayList<>();
        Map<Long,Map<String, Object>> aggregated = new HashMap<>();

        for (PollResponse pr : responses) {
            Map<String, Object> participant = new HashMap<>();
            participant.put("userId", pr.getUser().getId());
            if (poll.isAnonymous()) {
                participant.put("username", "Anonymous Respondent");
            } else {
                participant.put("username", pr.getResponderName());
            }

            Map<Long, String> answersMap = new HashMap<>();

            for (Answer a : pr.getAnswers()) {
                if (a.getValue() == null) continue;

                answersMap.put(a.getQuestion().getId(), a.getValue());

                Question q = a.getQuestion();
                if (q.getType() == QuestionType.BOOLEAN) {
                    aggregated.putIfAbsent(q.getId(), new HashMap<>(Map.of("yes", 0, "no", 0, "total", 0)));
                    Map<String, Object> aggMap = aggregated.get(q.getId());
                    aggMap.put("total", (int) aggMap.get("total") + 1);

                    if ("true".equalsIgnoreCase(a.getValue()) || "Yes".equalsIgnoreCase(a.getValue())) {
                        aggMap.put("yes", (int) aggMap.get("yes") + 1);
                    } else {
                        aggMap.put("no", (int) aggMap.get("no") + 1);
                    }
                } else if (q.getType() == QuestionType.NUMERIC) {
                    aggregated.putIfAbsent(q.getId(), new HashMap<>(Map.of("sum", 0.0, "totalResponses", 0, "average", 0.0)));
                    Map<String, Object> aggMap = aggregated.get(q.getId());

                    try {
                        double val = Double.parseDouble(a.getValue());
                        double sum = (double) aggMap.get("sum") + val;
                        int totalResp = (int) aggMap.get("totalResponses") + 1;
                        aggMap.put("sum", sum);
                        aggMap.put("totalResponses", totalResp);
                        aggMap.put("average", Math.round((sum / totalResp) * 10.0) / 10.0);
                    } catch (NumberFormatException ignored) {}
                }
            }
            participant.put("answers", answersMap);
            participants.add(participant);
        }

        result.put("participants", participants);
        result.put("aggregated", aggregated);

        return result;
    }

}