import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import CircularLoading from '../components/CircularLoading';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("Sending data:", formData); 

        if (!formData.username || !formData.password) {
            setMessage('⚠️ Please enter both username and password.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/login', formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.success) {
                const userData = response.data.user;

        // Ensure profileImageURL exists
        if (!userData.profileImageURL) {
          userData.profileImageURL = '';
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/menu'), 2000);
            } else {
                setMessage(response.data.error || 'Login failed!');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || 'Login failed!');
            } else {
                setMessage('An unknown error occurred!');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            {loading && <CircularLoading />}
            <div className="account-form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input 
                        type="text"
                        name="username"  
                        placeholder="Enter username"
                        value={formData.username} 
                        onChange={handleChange}
                        required
                    />
                    <label>Password:</label>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password} 
                        onChange={handleChange}
                        required
                    />
                    <input type="submit" value="Log in"/>
                </form>
                {message != '' && <p id="loginMsg">{message}</p>}
            </div>
        </main>
    );
}
