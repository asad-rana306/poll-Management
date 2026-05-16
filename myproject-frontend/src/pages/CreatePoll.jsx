import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../components/CreatePoll.css'
import '../pages/Navbar.jsx'
import Navbar from "./Navbar.jsx";

export default function CreatePoll() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [questions, setQuestions] = useState([{ text: '', type: 'plain-text' }]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', type: 'plain-text' }]);
    };

    const handleRemoveQuestion = (index) => {
        if (questions.length === 1) {
            setError("A poll must have at least one question.");
            return;
        }
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
        setError('');
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !dueDate) {
            setError('Title and Due Date are required.');
            return;
        }

        const hasEmptyQuestions = questions.some(q => !q.text.trim());
        if (hasEmptyQuestions) {
            setError('All questions must have text.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = { title, description, dueDate, questions };
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create poll. Title might already be taken.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-vh-100 backgroundPage text-light">
            <Navbar />
            <main className="container max-w-4xl py-3">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="PageTitle mb-0 ">Create a New Poll</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <section className="card shadow-sm mb-5 cardes border-0">
                        <div className="card-header border-bottom-0 pt-4 pb-0">
                            <h5 className="mb-0 text-white">Poll Details</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label htmlFor="pollTitle" className="form-label label">Poll Title *</label>
                                <input
                                    type="text"
                                    id="pollTitle"
                                    className="form-control placeHolderBox"
                                    placeholder="the title must be unique"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="pollDesc" className="form-label label">Description</label>
                                <textarea
                                    id="pollDesc"
                                    className="form-control placeHolderBox"
                                    rows="3"
                                    placeholder="Write here poll's description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="pollDate" className="form-label label">Due Date *</label>
                                <input
                                    type="datetime-local"
                                    id="pollDate"
                                    className="form-control placeHolderBox dateInput"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="card shadow-sm mb-5 cardes border-0">
                        <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-white">Questions</h5>
                            <button type="button"
                                    className="btn btn-sm addButton white-button" onClick={handleAddQuestion}>
                                + Add Question
                            </button>
                        </div>

                        <div className="card-body p-4 pt-2">
                            {questions.map((question, index) => (
                                <div key={index} className="card mb-4 questionBox border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                            <span className="badge questionNumberText">Question {index + 1}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm removeButton white-button"
                                                onClick={() => handleRemoveQuestion(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="row g-4">
                                            <div className="col-md-8">
                                                <label className="form-label label">Question Text *</label>
                                                <input
                                                    type="text"
                                                    className="form-control placeHolderBox"
                                                    placeholder="write a question"
                                                    value={question.text}
                                                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label label">Answer Type *</label>
                                                <select
                                                    className="form-select placeHolderBox"
                                                    value={question.type}
                                                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                                >
                                                    <option value="plain-text">Text</option>
                                                    <option value="boolean">Yes or No</option>
                                                    <option value="numeric">Numbers 1 to 5</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="d-grid gap-2 mt-2">
                        <button type="submit" className="btn btn-lg submitButton shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Poll' : 'Create Poll'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}