# Polling Management Application

Welcome to the Polling Management System, a complete full stack application that enables users to create, participate, and see result. This system is architected with React as frontend and Java as Backend, containerized through Docker.

---

## Tech Stack User

* **Frontend:** React + Vite, React Router, Bootstrap
* **Backend:** Java Spring Boot (JDK 25), Maven, Springdoc OpenAPI (Swagger UI)
* **Database:** MariaDB
* **Containerization:** Docker & Docker Compose

---

## System Architecture & Flow

### Application Workflow
1. **Authentication:** Users can sign up or log in. Passwords are securely encrypted on the backend, and user sessions are managed accordingly through spring security.

2. **Main Dashboard:** Upon successful login, users land on the dashboard where they can see the overview, a button to create a new poll, and card to see the pending poll and created poll.

3. **Poll Creation:** Users can fill out the form containing a Title, Description, Due Date, and multiple polling questions. The answer can be in text, numeric, and boolean format, based on the user who is creating it, and also he can make it anonymous so he see result without knowing who responded.

4. **Poll Management:** Under the "Created Polls" section, the creator can view their active polls, invite other registered users, update poll criteria, or manually delete and finish a poll before its due date and can view the result.

5. **Participation:** Users can view invitations from other users. Clicking a poll shows the list of questions, allowing the user to select an option or solve the question and he can not leave any question empty.

6. **Analytics & Results:** The results view is split into two insightful tabs:
* **Aggregate Summary:** Overall Result for all the participated user, which shows in averages.
* **Individual Responses:** It shows the individual response of all participated users.

---

## Extra Functions


* **Anonymous Polls:** Creators have a option to mark the poll as anonymous. so by this, the backend don't save the participant identity. The creator can see the aggregate statistics and plain-text answers, but he can't able to know who answer it.

* **Due Date & Expiry:** Polls are strictly time-bound.
    * **Frontend:** If the poll exceeds the due date, the system marks the poll as Expired and disables submission buttons.
    * **Backend:** The Backend prevents any submission request to an expired poll, ensuring that no data can be submitted after the deadline.

* **Client-Side Pagination:** To maintain performance and usability, the application implements pagination across the entire system.
    * **List Views:** The dashboard displays 5 polls per page.
    * **Participation Flow:** During participation, The poll questions are paginated 5 at a time.

---

## Docker

The project is fully containerized using Docker. On single command docker can run all three services.

### Architecture Components
1. **Frontend Container:** Packages the React + Vite static production build and serves it efficiently.

2. **Backend Container:** Packages the Java Spring Boot application runtime environment.

3. **Database Container:** Containing the credentials of MariaDB run it before the backend Service.

---

### Main (`docker-compose.yml`)
Instead of managing containers individually, the root docker-compose.yml file links the frontend, backend, and database services together. (Database ---> Backend ---> Frontend).

#### How to Launch the Entire Project
Open your terminal at the project root and run. Make sure that you are on the project root

```bash
docker compose up
```


# Frontend
# MyProject Frontend

A small React + Vite frontend for a polling app. This README is a quick,
human-friendly guide to what this project contains, how to run it locally,
and a few notes about the tech stack, project structure and flow.

- Built with React + Vite

Getting started
---------------

1. Make sure you have Node.js (v16+) and npm installed.
2. From this folder (`myproject-frontend`) run:

```bash
npm install
npm run dev
```

This runs Vite's dev server (usually on http://localhost:5173).
If you want to make a production build, run `npm run dev`
Available scripts
-----------------
- `npm run dev` — start dev server

Tech stack
----------
- React (functional components)
- Vite (dev server and build)
- React Router
- Bootstrap for basic styling

Data & Backend
--------------
For the backend, Spring boot apis are connected which handles all the business logic

Project structure (high level)
------------------------------
- `src/` — all React source files
  - `components/` — reusable components and styles
  - `pages/` — page-level components (signup, Login, Dashboard, PollResults, PendingPolls, ParticipatePoll, Navbar, CreatePoll, CreatedPoll)


Flow
----
1. User can sign up or log in.
2. After logging in, they see a dashboard with options to view pending polls and Created polls box.
   On the dashboard screen there is button to create a new poll. where user can create the poll
3. After clicking create new poll, user can fill the form which consists of title, description, due date and questions, which he can submit it to create a new poll.
4. After clicking to created poll on the dashboard. A user can see his created poll from where he can invite people to his created poll.
5. He can finish the poll, update the poll and delete the poll.
6. After clicking pending polls on the dashboard, user can see the list of pending polls and can click on any poll to participate in it.
7. After participating in the poll, user will see the list of question which he can solve and then he can submit
8. After clicking the view results in the created poll page, user can see two tabs Aggregate Summary and Individual response
9. On the Aggregate Summary, user can see the summary of poll in percetages(for the true false question) and rating(for the numeric questions)
10. On the Individual response, user can see the list of responses of all the users who participated in the poll with the question and there answer which they give.



# Backend (Java Spring Boot)
<h1>Created APIs</h1>

<h2>1. AuthenticationController</h2>

For Registering a user and save credentials in database, it will take username and password and automatically assign id. also it will encypt the password

    http://localhost:8080/api/auth/register

A register user can login by sending credentials (username and password)

    http://localhost:8080/api/auth/login

---

<h2>2. UserController</h2>

When user have to invite other user he needs a list of user so by this he will a list of users which are save in the database

    http://localhost:8080/api/users

---

<h2>3. PollController</h2>

A logged in user can create a poll by adding Tittle, Description and Due Date, and then he also have to add the question

    (POST)
    http://localhost:8080/api/poll/create-poll

After creating the poll, a user can see his created poll in the database after hitting this api

    (GET)
    http://localhost:8080/api/poll/created

A user after logged in can check who invited him. this api will fetch all his invition are not solved. if he reponsed then the invitation will be removed from the database

    (GET)
    http://localhost:8080/api/poll/pending

A user can delete the poll by hitting this api

     (DELETE)
    http://localhost:8080/api/poll/${id}

A user can invite other by this api

     (POST)
    http://localhost:8080/api/poll/${id}/invite

After solving the poll user can submit by this api

    (POST)
    http://localhost:8080/api/poll/${id}/submit

A user can open the poll and get the data to see the questions

    (GET)
    http://localhost:8080/api/poll/${id}

A User who created the poll and finish the poll before the due date

    (PUT)
    http://localhost:8080/api/poll/${id}/finish


A user can update the poll at any time

    (PUT)
    http://localhost:8080/api/poll/${id}

----


#### How you can see the Detailed HTML Report
After the test cases build jacoco build a html inside the target which you can open in browser to see the percentage of each class
1. Navigate to `target/site/jacoco/` inside your project folder.
2. Open the `index.html` file in the web browser.

---

### Test Cases APIs

#### 1. Controller APIs (`PollControllerTest` & `AuthenticationControllerTest`)

* **`testingbyCreatingPoll`**: This is done by sending all Data (title, description, date, questions, questionType) to the API to test if it works on /api/poll/create-poll.
* **`invitingUsertest`**: Checks if the payload has been delivered and if the username tracking has been enabled when a poll creator invites another voter through /api/poll/{id}/invite.
* **`testingBydeletingPoll`**: checks weather the deleting api send back a valid code
* **`finishingThePollTest`**: Verifies that the poll can be finished before the due date
* **`checkingDashboardSummaryDetails`**: Checks data formatting boundaries when loading overview metrics.
* **`getCreatedpolltest`**: confirming that the the user's created poll are being fetched or not.
* **`GettingThePollDataByUserIdandName`**:  It Gets the poll questions By send the username and id through payload.
* **`getResultofAPoll`**: It checks the stats of the users who was invited and responded the poll.
* **`EditingTheExitingPollTest`**: This test is to confirm the poll data can be updated successfully.
* **`verifyingTitleCheckApi`**:  this ensures that the title must be unique.
* **`TestingPendingPollAPI`**: It is to ensure that the pending poll exist of specific who is invited by other.
* **`TestingBYSubmitingTheAnswers`**: It checks that the user Response is accuratly submitted (no question should be empty).
* **`testingAllAvailablePollsApi`**: It fetch all the pending poll of the user.
* **`testingExistingUserWithoutCredential`**: This test is to ensure that the unauthenticated or with no credential, User can not access the APIs.
* **`TestingRegisteringUser`**: This is to ensure the registering new user with valid credential works smoothly.
* **`testingLoginAPI`**: This is to ensure that the Spring Security basic Aunthentication for login works perfectly.


#### 2. Service Package testing (`PollServiceTest`)

* **`TestingByCreatingThePoll`**: Testing by Creating the poll from Service Class.
* **`TestingBYInvitingOtherUser`**: Testing by inviting other user.
* **`TestingDeletingPollAPI`**: Deleting the exiting poll to ensure that only that poll is deleted. Doesn't harm any other data.
* **`TestingFinishingAPI`**: Testing the By Finishin the poll before the expiration.
* **`TestingSubmittingThePollResponse`**: Sumitting the poll Response Test.
* **`getingCreatedPollOfOwner`**: Getting all poll of the specific onwer by sending the name which filter from all the polls.
* **`GettingInvitedPollDataFromPendingPoll`**: Fetching the data from the pending poll which is invited by other user.
* **`GettingThePollsQuestions`**: It fetch all the questions created by the users.
* **`CreatingPollWithTHeTitleWhichisALreadyExist`**: It create poll with the title which is already savad in the DB. because the title must be unique.
* **`TestingUserCanNotInviteHimSelf`**:Testing the condition that the user can not invite himself.
* **`UpdatingThePollWhichisCreatedBYOtherUser`**: One user can not update the other user poll.
* **`SubmittingThePollWhichisALreadyAnswered`**: THis test is to ensure that a user can not answer the poll again.
* **`SubmittingExpiredPoll`**: It blocks the user from submitting the expired poll which we have added in the extra functionality.
* **`GettingPollOfthatUserwhoDidnotCreateAnypoll`**: This test is to ensure that the user who has not created any poll and the system must return the empty statement.
* **`checkAnonymsPollAndBoleanData`**: Checking the poll which is anonymus does not save the data of respondent and stats of Boolean data.
* **`checkingtheAverageNumericValue`**: This api is to check that the average stats of numeric answer is successfully fetched.

he Individual response, user can see the list of responses of all the users who participated in the poll with the question and there answer which they give.