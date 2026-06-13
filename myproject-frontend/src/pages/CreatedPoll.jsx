import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/CreatedPoll.css';
import Navbar from "./Navbar.jsx";

export default function CreatedPoll() {
    const navigate = useNavigate();
    const [polls,setPolls] = useState([])
    const [isLoading,setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPopUp,setShowPopUp] = useState(false)
    const [searchTxt, setSearchTxt] = useState('');
    const [selectedPoll, setSelectedPoll] = useState(null)
    const [usersList, setUsersList] = useState([]);
    const [updateQuestions, setUpdateQuestions] = useState([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [showUpdatePopUp, setShowUpdatePopUp] = useState(false)
    const [pollToUpdate, setPollToUpdate] = useState(null)
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDesc, setUpdateDesc] = useState('')
    const [updateDate, setUpdateDate] = useState('');


    useEffect(() => {
        fetchCreatedPolls();
    }, []);

    const fetchCreatedPolls = async () => {
        const token = localStorage.getItem('basicAuthToken');
        if (!token) {
            console.log("login again, your session expired")
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

            if (response.ok == true) {
                const data = await response.json();
                setPolls(data);
            } else {
                setError('we are failed to fetch your polls.');
            }
        } catch (err) {
            setError('may be teh network error');
            console.error("network side err: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openInvitePopUp = (pollId) => {
        console.log("ivitation screen is opening")
        setSelectedPoll(pollId);
        setShowPopUp(true);
        setSearchTxt('');
        fetchUsers();
    }

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
                console.log("fetching all the user, so you can invite")
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
                console.log("user is is invited")
                const modifiedList = usersList.map((u) => {
                    if (u.id === userId) {
                        return { ...u, invited: true };
                    }
                    return u;
                });
                setUsersList(modifiedList);
            } else {
                alert("Can't able to invite him may an issue");
            }
        } catch (error) {
            console.error('the error is: ', error);
        }
    };

    const handleDelete = async (pollId) => {
        if (!window.confirm("are your sure that you want to delete this poll?")) return;

        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${pollId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                console.log("poll is deleted")
                fetchCreatedPolls();
            } else {
                alert("can't able to delete this poll");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinish = async (pollId) => {
        if (!window.confirm("should we finish it")) return;

        const token = localStorage.getItem('basicAuthToken');
        try {
            const response = await fetch(`http://localhost:8080/api/poll/${pollId}/finish`, {
                method: 'PUT',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                console.log("poll is finished")
                fetchCreatedPolls();
            } else {
                alert("we are not able to finish your poll");
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

        setShowUpdatePopUp(true);

        try {
            const response = await fetch(`http://localhost:8080/api/poll/${poll.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.ok) {
                console.log("poll is fetch to update")
                const fullPollData = await response.json();
                setUpdateDesc(fullPollData.description || '');
                if (fullPollData.questions && fullPollData.questions.length > 0) {
                    setUpdateQuestions(fullPollData.questions);
                } else {
                    setUpdateQuestions([{ text: '', type: 'TEXT' }]);
                }
            } else {
                alert("Failed to load full poll detals.");
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
        setUpdateQuestions([...updateQuestions, { text: '', type: 'TEXT' }]);
    };

    const handleRemoveUpdateQuestion = (index) => {
        if (updateQuestions.length === 1) {
            alert("please add at least one question");
            return;
        }
        const remainingQuestions = updateQuestions.filter((_, itemIndex) => {
            return itemIndex !== index;
        });
        setUpdateQuestions(remainingQuestions);
    };

    const handleUpdateQuestionChange = (index, field, value) => {
        console.log("question is changed")
        const localCopy = [...updateQuestions];
        localCopy[index][field] = value;
        setUpdateQuestions(localCopy);
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
        console.log("updated")
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
                console.log("poll is fully updated")
                closeUpdatePopUp();
                fetchCreatedPolls();
            } else {
                alert("title must be unique. you've already created the poll with the same title. change this one");
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

            <div className="empty-spacer-wrapper" style={{paddingTop: '5px'}}></div>
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
                        <div className="inner-polls-holder">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {polls.map((poll) => {
                                    const isPollFinished = poll.solutionStatus || poll.isFinished || poll.finished;

                                    return (
                                        <div className="col" key={poll.id}>
                                            <div
                                                className="card cardBackgroundColor CardHovering shadow"
                                                style={{ height: 'auto', minHeight: '100%', overflow: 'visible', paddingBottom: '10px' }}
                                            >
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
                    </div>
                )}
            </div>

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
                                    <div key={user.id} className="d-flex justify-content-between align-items-center p-2 mb-2  " style={{ borderBottom: '1px solid #334155' }}>
                                        <div><div className="text-light fs-5 ">{user.username}</div></div>
                                        <div>
                                            <div>
                                            {user.invited ? (
                                                <button className="btn btn-sm btn-secondary" disabled>Invited</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleInviteUser(user.id, user.username)}>
                                                    + Invite
                                                </button>
                                            )
                                        } </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {showUpdatePopUp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0,  width: '100vw', height: '100vh' ,
                    backgroundColor: 'rgba(0,0,0,0.75 )',
                    display: 'flex', justifyContent: 'center',  alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="cardBackgroundColor p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155' }}>

                        <div className="d-flex justify-content-between align-items-center mb-4 " style={{ backgroundColor: 'inherit' }}>
                            <h4 className="text-light  mb-0">Update Poll</h4>
                            <button className="btn btn-sm  btn-danger " onClick={closeUpdatePopUp}>X</button>
                        </div>

                        <div className="modal-form-spacer " style={{height: "2px"}}></div>

                        <form onSubmit={submitUpdate}>
                            <div className="mb-3">
                                <div>
                                <label className="form-label  text-light">Title *</label>
                                <input
                                    type="text"
                                    className="  form-control bg-dark text-light border-secondary"
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    required
                                />
                                </div>
                            </div>


                            <div>

                            <div className="mb-3">
                                <label className="form-label  text-light ">Description</label>
                                <textarea
                                    className="form-control bg-dark  text-light border-secondary "
                                    rows="2"
                                    value={updateDesc}
                                    onChange={(e) => setUpdateDesc(e.target.value)}
                                />
                            </div>
                            </div>

                            <div className="mb-4 ">
                                <label className="form-label  text-light">Due Date *</label>
                                <input
                                    type="datetime-local"
                                    className="form-control bg-dark text-light border-secondary "
                                    value={updateDate}
                                    onChange={(e) => setUpdateDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="my-4 " style={{borderTop: '1px solid #475569 ', opacity: 0.25}}></div>

                            ِ<div>
                            <div className="d-flex  justify-content-between align-items-center mb-3">
                                <h5 className="text-light  mb-0">Edit Questions</h5>
                                <button type="button" className="btn btn-sm btn-outline-info" onClick={handleAddUpdateQuestion}>
                                    + Add Question
                                </button>
                            </div>
                            </div>

                            <div className="questions-list-wrapper">
                                {updateQuestions.length === 0 ? (
                                    <p className="text-muted">Loading questions...</p>
                                ) : (
                                    updateQuestions.map((q, index) => (
                                        <div key={index} className="p-3 mb-3 rounded" style={{ backgroundColor: '#1e293b' }}>
                                            <div className="d-flex   justify-content-between mb-2">
                                                <span className="badge bg-secondary">Q{index + 1}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm  btn-outline-danger py-0 px-2"
                                                    onClick={() => handleRemoveUpdateQuestion(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row  g-2">
                                                <div className="col-md-8 ">
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
                                                    <div className = "">
                                                        <option value="TEXT">Text</option>
                                                        <option value="BOOLEAN">Yes or No</option>
                                                        <option value="NUMERIC">Numbers 1 to 5</option>
                                                    </div>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

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