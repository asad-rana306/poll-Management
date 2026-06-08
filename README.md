# Polling Management Application

Welcome to the **Polling Management System**, a complete full stack application that enables users to create, participate, and see result. This system is architected with React as frontend and Java as Backend, containerized through Docker.

---

## Tech Stack User

* **Frontend:** React + Vite, React Router, Bootstrap
* **Backend:** Java Spring Boot (JDK 25), Maven, Springdoc OpenAPI (Swagger UI)
* **Database:** MariaDB
* **Containerization:** Docker & Docker Compose

---

## 📁 System Architecture & Flow

### Application Workflow
**1.** **Authentication:** Users can sign up or log in. Passwords are securely encrypted on the backend, and user sessions are managed accordingly through spring security.

**2.** **Main Dashboard:** Upon successful login, users land on the dashboard where they can see the overview, a button to create a new poll, and a button to see the past poll results and pending poll and created poll also.

**3.** **Poll Creation:** Users can fill out the form containing a Title, Description, Due Date, and multiple polling questions the answer can be in text, numeric and boolean, it based on the user who is creating it.

**4.** **Poll Management:** Under the "Created Polls" section, the creator can view their active polls, invite other registered users, update poll criteria, or manually delete and finish a poll before its due date.

**5.** **Participation:** Users can view invitaion from other users. Clicking a poll the list of questions, allowing the user to select an option or solve the question.

**6.** **Analytics & Results:** The results view is split into two insightful tabs:
* **Aggregate Summary:** Overall Result for all the participated user, which show in percentage
* **Individual Responses:** It shows the individual reponse of all participated users.

---

