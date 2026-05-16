import { Link, useNavigate } from 'react-router-dom';
import '../components/signup.css';

export default function Signup() {
    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        // signup api (localhost:8080/signup)
        navigate('/login');
    };

    return (
        <div className="fullPage">
            <div className="box">
                <div className="Heading">Create Account</div>



                <form onSubmit={register}>
                    <div className="label">
                        <label className="inputingtext">Name</label>
                        <input
                            type="text"
                            className="textstyle"
                            required
                            placeholder="Alex"
                        />
                    </div>
                    <div className="label">
                        <label className="inputingtext">Password</label>
                        <input
                            type="password"
                            className="textstyle"
                            required
                            placeholder="******"
                        />
                    </div>

                    <button type="submit" className="submit">
                        Register
                    </button>

                    <div className="loginOption">
                        <span className="logintext">Already have an account? </span>
                        <Link to="/login" className="link">Log in here</Link>
                    </div>
                </form>



            </div>
        </div>
    );
}