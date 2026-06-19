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


### API Documentation Dependency
I got the Swagger UI dependency from official Maven Repository website and it url is https://mvnrepository.com/artifact/org.springdoc/springdoc-openapi-starter-webmvc-ui/2.8.5.

It Automatically make the UI to run on browser on this URL
http://localhost:8080/swagger-ui/index.html
<h3>The swagger UI dependency </h3>

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.5</version>
</dependency>
````
---


<h2>Use of AI</h2>
Due to the usage of lombok we added dependency from spring intializr but it was giving error of version so i use AI for that


```
        <lombok.version>1.18.46</lombok.version>


          <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>25</source>
                    <target>25</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>

```