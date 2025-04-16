import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/blogs', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://hteshpatel-dev-blog-api-4baa7ed6c2cf.herokuapp.com/api/auth/login`, {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isAdmin', 'true');
            window.location.href = '/add-blog';
        } catch (err) {
            setError('Invalid credentials.');
        }
    };

    return (
        <section className="login-section">
            <h2 className="section-headings">Admin Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter password"
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="submit-button">Login</button>
            </form>
        </section>
    );
};

export default Login;