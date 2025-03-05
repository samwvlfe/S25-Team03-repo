import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Sending data:", formData); 

        if (!formData.username || !formData.password) {
            setMessage('Please enter both username and password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:2999/api/login', formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.success) {
                setMessage('Login successful! Redirecting...');
                setTimeout(() => navigate('/menu'), 2000);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user data
            } else {
                setMessage(response.data.error || 'Login failed');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.error || 'Login failed');
            } else {
                setMessage('An unknown error occurred');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <main className="account-form">
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
            <p>{message}</p>
        </main>
    );
}
