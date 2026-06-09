import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/CreatedPoll.css';
import Navbar from "./Navbar.jsx";

export default function CreatedPoll() {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [showPopUp, setShowPopUp] = useState(false);
    const [searchTxt, setSearchTxt] = useState('');
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [usersList, setUsersList] = useState([]);

    const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
    const [pollToUpdate, setPollToUpdate] = useState(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDesc, setUpdateDesc] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [updateQuestions, setUpdateQuestions] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchCreatedPolls();
    }, []);

    const fetchCreatedPolls = async () => {
        const token = localStorage.getItem('basicAuthToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/poll/created', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPolls(data);
            } else {
                setError('Failed to load your polls.');
            }
        } catch (err) {
            setError('Network error. Is the server running?');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const mappedUsers = data.map(u => ({ ...u, invited: false }));
                setUsersList(mappedUsers);
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const openInvitePopUp = (pollId) => {
        setSelectedPoll(pollId);
        setShowPopUp(true);
        setSearchTxt('');
        fetchUsers();
    };

    const closePopUp = () => {
        setShowPopUp(false);
        setSelectedPoll(null);
    };

    const handleInviteUser = async (userId, username) => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${selectedPoll}/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setUsersList(usersList.map(u => u.id === userId ? { ...u, invited: true } : u));
            } else {
                alert("Failed to invite user. They might already be invited.");
            }
        } catch (err) {
            console.error('Network error during invite', err);
        }
    };

    const handleDelete = async (pollId) => {
        if (!window.confirm("Are you sure you want to delete this poll permanently?")) return;

        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${pollId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                fetchCreatedPolls();
            } else {
                alert("Failed to delete poll.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFinish = async (pollId) => {
        if (!window.confirm("Are you sure you want to close this poll? No one else will be able to answer.")) return;

        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${pollId}/finish`, {
                method: 'PUT',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                fetchCreatedPolls();
            } else {
                alert("Failed to finish poll.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openUpdatePopUp = async (poll) => {
        const token = localStorage.getItem('basicAuthToken');

        setPollToUpdate(poll.id);
        setUpdateTitle(poll.title);
        const formattedDate = poll.dueDate ? new Date(poll.dueDate).toISOString().slice(0, 16) : '';
        setUpdateDate(formattedDate);
        setUpdateDesc('Loading description...');
        setUpdateQuestions([]);

        setShowUpdatePopUp(true);

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${poll.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                const fullPollData = await response.json();
                setUpdateDesc(fullPollData.description || '');
                setUpdateQuestions(fullPollData.questions?.length > 0 ? fullPollData.questions : [{ text: '', type: 'TEXT' }]);
            } else {
                alert("Failed to load full poll details for editing.");
                setShowUpdatePopUp(false);
            }
        } catch (err) {
            console.error("Error fetching full poll:", err);
        }
    };

    const closeUpdatePopUp = () => {
        setShowUpdatePopUp(false);
        setPollToUpdate(null);
    };

    const handleAddUpdateQuestion = () => {
        setUpdateQuestions([...updateQuestions, { text: '', type: 'TEXT' }]);
    };

    const handleRemoveUpdateQuestion = (index) => {
        if (updateQuestions.length === 1) {
            alert("A poll must have at least one question.");
            return;
        }
        setUpdateQuestions(updateQuestions.filter((_, i) => i !== index));
    };

    const handleUpdateQuestionChange = (index, field, value) => {
        const updated = [...updateQuestions];
        updated[index][field] = value;
        setUpdateQuestions(updated);
    };

    const submitUpdate = async (e) => {
        e.preventDefault();

        // Validation
        const hasEmptyQuestions = updateQuestions.some(q => !q.text.trim());
        if (hasEmptyQuestions) {
            alert('All questions must have text.');
            return;
        }

        const token = localStorage.getItem('basicAuthToken');
        setIsUpdating(true);

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${pollToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: updateTitle,
                    description: updateDesc,
                    dueDate: updateDate,
                    questions: updateQuestions
                })
            });

            if (response.ok) {
                closeUpdatePopUp();
                fetchCreatedPolls();
            } else {
                alert("Failed to update poll. Title might already be taken.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-vh-100 pageBackground text-light ">
            <Navbar />
            <main className="container max-w-4xl py-3">
                <div>
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="title mb-0">My Created Polls</h2>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert shadow-sm alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center mt-5 py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text1">Fetching your polls...</p>
                    </div>
                ) : polls.length === 0 ? (
                    <div className="card text-center p-5 lightPageBackground">
                        <p className="mb-0 text-light">Empty! You haven't created any polls yet.</p>
                    </div>
                ) : (
                    <div>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {polls.map((poll) => (
                                <div className="col" key={poll.id}>
                                    <div
                                        className="card cardBackgroundColor CardHovering shadow"
                                        style={{ height: 'auto', minHeight: '100%', overflow: 'visible', paddingBottom: '10px' }}
                                    >
                                        <div className="card-body d-flex flex-column p-4">

                                            <div className="mb-3">
                                                <h5 className="card-title pollTitle">
                                                    <span>{poll.title}</span>
                                                </h5>
                                            </div>

                                            <div className="mt-2 mb-4 cardInsideCard">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div>
                                                        <span className="textColor1">Due Date: </span>
                                                        <span className="dateText">{new Date(poll.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <span className="textColor1">Questions: </span>
                                                        <span className="badge fs-5">{poll.numberOfQuestions}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="mb-3">
                                                    <button
                                                        className="btn btn-outline-info w-100"
                                                        onClick={() => openInvitePopUp(poll.id)}
                                                        disabled={poll.isFinished}
                                                    >
                                                        {poll.isFinished ? 'Poll Closed' : 'Invite People'}
                                                    </button>
                                                </div>

                                               <div className="d-flex gap-2">
                                                   <button
                                                       className="btn btn-sm btn-outline-warning w-100"
                                                       onClick={() => openUpdatePopUp(poll)}
                                                       disabled={poll.isFinished}
                                                   >
                                                       Edit
                                                   </button>
                                                   <button
                                                       className="btn btn-sm btn-outline-success w-100"
                                                       onClick={() => handleFinish(poll.id)}
                                                       disabled={poll.isFinished}
                                                   >
                                                       Finish
                                                   </button>
                                                   <button
                                                       className="btn btn-sm btn-outline-danger w-100"
                                                       onClick={() => handleDelete(poll.id)}
                                                   >
                                                       Delete
                                                   </button>
                                               </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {showPopUp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="cardBackgroundColor p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '450px', border: '1px solid #334155' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-light mb-0">Invite to Poll</h4>
                            <button className="btn btn-sm btn-danger" onClick={closePopUp}>X</button>
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-secondary searching"
                                placeholder="Search user"
                                value={searchTxt}
                                onChange={(e) => setSearchTxt(e.target.value)}
                            />
                        </div>

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {usersList
                                .filter(u => u.username.toLowerCase().includes(searchTxt.toLowerCase()))
                                .map(user => (
                                    <div key={user.id} className="d-flex justify-content-between align-items-center p-2 mb-2" style={{ borderBottom: '1px solid #334155' }}>
                                        <div><div className="text-light fs-5">{user.username}</div></div>
                                        <div>
                                            {user.invited ? (
                                                <button className="btn btn-sm btn-secondary" disabled>Invited</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleInviteUser(user.id, user.username)}>
                                                    + Invite
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {showUpdatePopUp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="cardBackgroundColor p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155' }}>

                        <div className="d-flex justify-content-between align-items-center mb-4 sticky-top pt-2" style={{ backgroundColor: 'inherit' }}>
                            <h4 className="text-light mb-0">Update Poll</h4>
                            <button className="btn btn-sm btn-danger" onClick={closeUpdatePopUp}>X</button>
                        </div>

                        <form onSubmit={submitUpdate}>
                            <div className="mb-3">
                                <label className="form-label text-light">Title *</label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-secondary"
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light">Description</label>
                                <textarea
                                    className="form-control bg-dark text-light border-secondary"
                                    rows="2"
                                    value={updateDesc}
                                    onChange={(e) => setUpdateDesc(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-light">Due Date *</label>
                                <input
                                    type="datetime-local"
                                    className="form-control bg-dark text-light border-secondary"
                                    value={updateDate}
                                    onChange={(e) => setUpdateDate(e.target.value)}
                                    required
                                />
                            </div>

                            <hr className="border-secondary mb-4" />

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="text-light mb-0">Edit Questions</h5>
                                <button type="button" className="btn btn-sm btn-outline-info" onClick={handleAddUpdateQuestion}>
                                    + Add Question
                                </button>
                            </div>

                            {updateQuestions.length === 0 ? (
                                <p className="text-muted">Loading questions...</p>
                            ) : (
                                updateQuestions.map((q, index) => (
                                    <div key={index} className="p-3 mb-3 rounded" style={{ backgroundColor: '#1e293b' }}>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="badge bg-secondary">Q{index + 1}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                                onClick={() => handleRemoveUpdateQuestion(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-md-8">
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    placeholder="Question Text"
                                                    value={q.text}
                                                    onChange={(e) => handleUpdateQuestionChange(index, 'text', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <select
                                                    className="form-select bg-dark text-light border-secondary"
                                                    value={q.type}
                                                    onChange={(e) => handleUpdateQuestionChange(index, 'type', e.target.value)}
                                                >
                                                    <option value="TEXT">Text</option>
                                                    <option value="BOOLEAN">Yes or No</option>
                                                    <option value="NUMERIC">Numbers 1 to 5</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isUpdating}>
                                {isUpdating ? 'Saving Changes...' : 'Save All Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}