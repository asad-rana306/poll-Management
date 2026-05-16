import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard.jsx';
import CreatePoll from './pages/CreatePoll';
import PendingPolls from './pages/PendingPolls';
import ParticipatePoll from './pages/ParticipatePoll';
import PollResults from './pages/PollResults';
import Navbar from "./pages/Navbar.jsx";
import './components/Login.css'
import './components/signup.css'
import './components/Dashboard.css'
import './components/CreatePoll.css'
import './components/PendingPolls.css'
import './components/ParticipatePoll.css'
import './components/Navbar.css'
import CreatedPoll from "./pages/CreatedPoll.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/pending-polls" element={<PendingPolls />} />
          <Route path="/created-poll" element={<CreatedPoll />} />
          <Route path="/poll/:id/participate" element={<ParticipatePoll/>} />
          <Route path="/poll/:id/results" element={<PollResults />} />


      </Routes>
      </BrowserRouter>
  );
}

export default App;