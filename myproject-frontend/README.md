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

Icons
-----
The icons are basically emojis that i got from the whatsapp emoji keypad by searching note 📝 and hour ⏳.

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