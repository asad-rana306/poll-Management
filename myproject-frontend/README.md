# MyProject Frontend

A small React + Vite frontend for a polling app. This README is a quick, 
human-friendly guide to what this project contains, how to run it locally, 
and a few notes about the tech stack, project structure and flow.

TL;DR
- Built with React + Vite
- it uses some simple fake data for now

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
The backend is not connected right. we will integrate the Backend spring boot Api
in it to interact with the real data from the database. for now, we have used the 
fake data just to show the UI design of our project. 

Project structure (high level)
------------------------------
- `src/` — all React source files
  - `components/` — reusable components and styles
  - `pages/` — page-level components (signup, Login, Dashboard, PollResults, PendingPolls, ParticipatePoll, Navbar, CreatePoll, CreatedPoll)

User of AI
---------
Gemini 3.1 Pro was used for code formatting, structural optimization on pre-written code chunks.
This prompt is used for every message on the AI

`bash`
``````
(Chunks of code)
Please Optimize the structure of the code but don't change the style, and the flow
``````

TODO
----
- Connect real backend API and remove fake data
- Add tests

Flow
----
1. User can sign up or log in.
2. After logging in, they see a dashboard with options to view pending polls and Created polls box
On the dashboard screen there is button to create a new poll and on the botton it can view the results
of the polls that are solved by other users.
3. After clicking create new poll, user can fill the form and submit it to create a new poll.
4. After clicking pending polls, user can see the list of pending polls and can click on any poll to participate in it.
5. After participating in the poll, user will see the list of question which he can solve and then he can submit
6. After clicking the view results, user can see two tabs Aggregate Summary and Individual response
7. On the Aggregate Summary, user can see the summary of poll in percetages(for the true false question) and rating(for the numeric questions)
8. On the Individual response, user can see the list of responses of all the users who participated in the poll with the question and there answer which they give.