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
    const [updateQuestions, setUpdateQuestions] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
    const [pollToUpdate, setPollToUpdate] = useState(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDesc, setUpdateDesc] = useState('');
    const [updateDate, setUpdateDate] = useState('');

    const [showDeleteUI, setShowDeleteUI] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [showFinishUI, setShowFinishUI] = useState(false);
    const [finishTargetId, setFinishTargetId] = useState(null);

    // --- POLL PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const pollsPerPage = 5;

    // --- QUESTION PAGINATION STATE ---
    const [currentQPage, setCurrentQPage] = useState(1);
    const questionsPerPage = 5;

    useEffect(() => {
        fetchCreatedPolls();
    }, []);

    const fetchCreatedPolls = async () => {
        const token = localStorage.getItem('basicAuthToken');
        if (!token) {
            console.log("login again, your session expired");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/poll/created', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + token,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok === true) {
                const data = await response.json();
                setPolls(data);

                const totalPagesAvailable = Math.ceil(data.length / pollsPerPage);
                if (currentPage > totalPagesAvailable && totalPagesAvailable > 0) {
                    setCurrentPage(totalPagesAvailable);
                }
            } else {
                setError('we are failed to fetch your polls.');
            }
        } catch (err) {
            setError('may be the network error');
            console.error("network side err: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openInvitePopUp = (pollId) => {
        console.log("invitation screen is opening");
        setSelectedPoll(pollId);
        setShowPopUp(true);
        setSearchTxt('');
        fetchUsers();
    };

    const closePopUp = () => {
        setShowPopUp(false);
        setSelectedPoll(null);
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const mappedUsers = data.map(function(item) {
                    return { ...item, invited: false };
                });
                setUsersList(mappedUsers);
            }
        } catch (error) {
            console.error('user are not fetched', error);
        }
    };

    const handleInviteUser = async (userId, username) => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${selectedPoll}/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                const modifiedList = usersList.map((u) => {
                    if (u.id === userId) {
                        return { ...u, invited: true };
                    }
                    return u;
                });
                setUsersList(modifiedList);
            } else {
                setError("Can't able to invite him may an issue");
            }
        } catch (error) {
            console.error('the error is: ', error);
        }
    };

    const handleDelete = (pollId) => {
        setDeleteTargetId(pollId);
        setShowDeleteUI(true);
    };

    const executeDelete = async () => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${deleteTargetId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                setShowDeleteUI(false);
                setDeleteTargetId(null);
                fetchCreatedPolls();
            } else {
                setShowDeleteUI(false);
                setError("can't able to delete this poll");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinish = (pollId) => {
        setFinishTargetId(pollId);
        setShowFinishUI(true);
    };

    const executeFinish = async () => {
        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${finishTargetId}/finish`, {
                method: 'PUT',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                setShowFinishUI(false);
                setFinishTargetId(null);
                fetchCreatedPolls();
            } else {
                setShowFinishUI(false);
                setError("we are not able to finish your poll");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openUpdatePopUp = async (poll) => {
        const token = localStorage.getItem('basicAuthToken');

        setPollToUpdate(poll.id);
        setUpdateTitle(poll.title);
        const dateRaw = poll.dueDate ? new Date(poll.dueDate).toISOString().slice(0, 16) : '';
        setUpdateDate(dateRaw);
        setUpdateDesc('Description is loading ....');
        setUpdateQuestions([]);
        setCurrentQPage(1);

        setShowUpdatePopUp(true);

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${poll.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                const fullPollData = await response.json();
                setUpdateDesc(fullPollData.description || '');
                if (fullPollData.questions && fullPollData.questions.length > 0) {
                    setUpdateQuestions(fullPollData.questions);
                } else {
                    setUpdateQuestions([{ text: '', type: 'TEXT' }]);
                }
            } else {
                setError("Failed to load full poll details.");
                setShowUpdatePopUp(false);
            }
        } catch (err) {
            console.error("Error fetching whole poll:", err);
        }
    };

    const closeUpdatePopUp = () => {
        setShowUpdatePopUp(false);
        setPollToUpdate(null);
    };

    const handleAddUpdateQuestion = () => {
        const newQuestions = [...updateQuestions, { text: '', type: 'TEXT' }];
        setUpdateQuestions(newQuestions);
        setCurrentQPage(Math.ceil(newQuestions.length / questionsPerPage));
    };

    const handleRemoveUpdateQuestion = (absoluteIndex) => {
        if (updateQuestions.length === 1) {
            setError("please add at least one question");
            return;
        }
        const remainingQuestions = updateQuestions.filter((_, i) => i !== absoluteIndex);
        setUpdateQuestions(remainingQuestions);

        const newTotalPages = Math.ceil(remainingQuestions.length / questionsPerPage);
        if (currentQPage > newTotalPages && newTotalPages > 0) {
            setCurrentQPage(newTotalPages);
        }
    };

    const handleUpdateQuestionChange = (absoluteIndex, field, value) => {
        const localCopy = [...updateQuestions];
        localCopy[absoluteIndex][field] = value;
        setUpdateQuestions(localCopy);
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
        const hasEmptyQuestions = updateQuestions.some(q => !q.text.trim());
        if (hasEmptyQuestions) {
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
                setError("title must be unique. you've already created the poll with the same title. change this one");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };
    const indexOfLastPoll = currentPage * pollsPerPage;
    const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
    const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
    const totalPages = Math.ceil(polls.length / pollsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const indexOfLastQ = currentQPage * questionsPerPage;
    const indexOfFirstQ = indexOfLastQ - questionsPerPage;
    const currentQs = updateQuestions.slice(indexOfFirstQ, indexOfLastQ);
    const totalQPages = Math.ceil(updateQuestions.length / questionsPerPage);

    return (
        <div className="min-vh-100 pageBackground text-light">
            <Navbar />

            <div className="empty-spacer-wrapper"></div>
            <div className="container max-w-4xl py-3">
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
                        <div className="inner-polls-holder mb-4">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {currentPolls.map((poll) => {
                                    const isPollFinished = poll.solutionStatus || poll.isFinished || poll.finished;

                                    return (
                                        <div className="col" key={poll.id}>
                                            <div className="card cardBackgroundColor CardHovering shadow poll-card-layout">
                                                <div className="card-body d-flex flex-column p-4">

                                                    <div className="mb-3">
                                                        <h5 className="card-title pollTitle">
                                                            <span>{ poll.title }</span>
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
                                                                disabled={isPollFinished}
                                                            >
                                                                {isPollFinished ? 'Poll Closed' : 'Invite People'}
                                                            </button>
                                                        </div>

                                                        <div className="mb-2">
                                                            <button
                                                                className="btn btn-sm btn-primary w-100 fw-bold py-2"
                                                                onClick={() => navigate(`/poll/${poll.id}/results`)}
                                                            >
                                                                View Results
                                                            </button>
                                                        </div>

                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-warning w-100"
                                                                onClick={() => openUpdatePopUp(poll)}
                                                                disabled={isPollFinished}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-success w-100"
                                                                onClick={() => handleFinish(poll.id)}
                                                                disabled={isPollFinished}
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
                                    );
                                })}
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                <button className="btn btn-outline-info" onClick={prevPage} disabled={currentPage === 1}>
                                    &laquo; Previous
                                </button>
                                <span className="text-light">
                                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                                </span>
                                <button className="btn btn-outline-info" onClick={nextPage} disabled={currentPage === totalPages}>
                                    Next &raquo;
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showDeleteUI && (
                <div className="modal-overlay">
                    <div className="cardBackgroundColor p-4 rounded shadow-lg text-center modal-content-small">
                        <h4 className="text-light mb-3">Delete Poll</h4>
                        <p className="text-light mb-4">Are your sure that you want to delete this poll?</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-sm btn-secondary" onClick={() => { setShowDeleteUI(false); setDeleteTargetId(null); }}>Cancel</button>
                            <button className="btn btn-sm btn-danger" onClick={executeDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showFinishUI && (
                <div className="modal-overlay">
                    <div className="cardBackgroundColor p-4 rounded shadow-lg text-center modal-content-small">
                        <h4 className="text-light mb-3">Finish Poll</h4>
                        <p className="text-light mb-4">Should we finish it?</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-sm btn-secondary" onClick={() => { setShowFinishUI(false); setFinishTargetId(null); }}>Cancel</button>
                            <button className="btn btn-sm btn-success" onClick={executeFinish}>Finish</button>
                        </div>
                    </div>
                </div>
            )}

            {showPopUp && (
                <div className="modal-overlay">
                    <div className="cardBackgroundColor p-4 rounded shadow-lg modal-content-box">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-light mb-0">Invite to Poll</h4>
                            <button className="btn btn-sm btn-danger" onClick={closePopUp}>X</button>
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control bg-dark text-light border-secondary searching" placeholder="Search user" value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} />
                        </div>
                        <div className="scrollable-list">
                            {usersList.filter(u => u.username.toLowerCase().includes(searchTxt.toLowerCase())).map(user => (
                                <div key={user.id} className="d-flex justify-content-between align-items-center p-2 mb-2 list-item-border">
                                    <div><div className="text-light fs-5 ">{user.username}</div></div>
                                    <div>
                                        {user.invited ? (
                                            <button className="btn btn-sm btn-secondary" disabled>Invited</button>
                                        ) : (
                                            <button className="btn btn-sm btn-primary" onClick={() => handleInviteUser(user.id, user.username)}>+ Invite</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showUpdatePopUp && (
                <div className="modal-overlay">
                    <div className="cardBackgroundColor p-4 rounded shadow-lg modal-content-large">
                        <div className="d-flex justify-content-between align-items-center mb-4 modal-header-sticky">
                            <h4 className="text-light mb-0">Update Poll</h4>
                            <button className="btn btn-sm btn-danger" onClick={closeUpdatePopUp}>X</button>
                        </div>
                        <div className="modal-form-spacer"></div>
                        <form onSubmit={submitUpdate}>
                            <div className="mb-3">
                                <div>
                                    <label className="form-label text-light">Title *</label>
                                    <input type="text" className="form-control bg-dark text-light border-secondary" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} required />
                                </div>
                            </div>
                            <div>
                                <div className="mb-3">
                                    <label className="form-label text-light ">Description</label>
                                    <textarea className="form-control bg-dark text-light border-secondary " rows="2" value={updateDesc} onChange={(e) => setUpdateDesc(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-light">Due Date *</label>
                                <input type="datetime-local" className="form-control bg-dark text-light border-secondary" value={updateDate} onChange={(e) => setUpdateDate(e.target.value)} required />
                            </div>
                            <div className="my-4 form-separator"></div>
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-light mb-0">Edit Questions</h5>
                                    <button type="button" className="btn btn-sm btn-outline-info" onClick={handleAddUpdateQuestion}>+ Add Question</button>
                                </div>
                            </div>

                            <div className="questions-list-wrapper">
                                {updateQuestions.length === 0 ? (
                                    <p className="text-muted">Loading questions...</p>
                                ) : (
                                    currentQs.map((q, localIndex) => {
                                        const absoluteIndex = indexOfFirstQ + localIndex;

                                        return (
                                            <div key={absoluteIndex} className="p-3 mb-3 rounded question-edit-box">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="badge bg-secondary">Q{absoluteIndex + 1}</span>
                                                    <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => handleRemoveUpdateQuestion(absoluteIndex)}>Remove</button>
                                                </div>
                                                <div className="row g-2">
                                                    <div className="col-md-8">
                                                        <input type="text" className="form-control bg-dark text-light border-secondary" placeholder="Question Text" value={q.text} onChange={(e) => handleUpdateQuestionChange(absoluteIndex, 'text', e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <select className="form-select bg-dark text-light border-secondary" value={q.type} onChange={(e) => handleUpdateQuestionChange(absoluteIndex, 'type', e.target.value)}>
                                                            <option value="TEXT">Text</option>
                                                            <option value="BOOLEAN">Yes or No</option>
                                                            <option value="NUMERIC">Numbers 1 to 5</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {totalQPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-3 p-2 rounded pagination-wrapper">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setCurrentQPage(p => Math.max(p - 1, 1))}
                                        disabled={currentQPage === 1}
                                    >
                                        &laquo; Prev
                                    </button>
                                    <span className="text-light small">
                                        Questions Page <strong>{currentQPage}</strong> of <strong>{totalQPages}</strong>
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setCurrentQPage(p => Math.min(p + 1, totalQPages))}
                                        disabled={currentQPage === totalQPages}
                                    >
                                        Next &raquo;
                                    </button>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isUpdating}>
                                {isUpdating ? 'Saving Changes...' : 'Save All Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}