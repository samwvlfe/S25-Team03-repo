"use client"; 

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const PasswordChange: React.FC = () => {
    const [username, setUsername] = useState('');
    const [u_table, setUTable] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !u_table || !currentPassword || !newPassword) {
            setMessage('Please fill in all fields.');
            return;
        }

        // Retrieve user data from local storage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");


        // Validate stored hash format
        if (!userData.pass || userData.pass.length !== 60) {
            setMessage('Stored password hash is invalid.');
            return;
        }

        // Compare current password with stored hash
        const isMatch = await bcrypt.compare(currentPassword, userData.pass);
        if (!isMatch) {
            setMessage('Current password is incorrect.');
            return;
        }

        try { //call procedure
            const response = await fetch('http://localhost:2999/api/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ u_table, username, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password updated successfully!');
                // alert user to log out and log back in
                setTimeout(() => {
                    window.alert("Please log out and log back in.");
                }, 1500);
            } else {
                setMessage(`Error: ${data.error}`);
            }

        } catch (error: any) {
            setMessage(`An error occurred: ${error.message}`);
        }
    };

    return (
        <main>
            <div className="account-form">
                <h1>Change Password</h1>

                <form className="application-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username: </label>
                        <input 
                            type="text" 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        <label htmlFor="u_table">User Type: </label>
                        <input 
                            type="text" 
                            id="u_table" 
                            value={u_table} 
                            onChange={(e) => setUTable(e.target.value)} 
                            required 
                        />
                        <p className="user-types">{"(1 - Admin, 2 - SponsorUser, 3 - Driver)"}</p>
                        <label htmlFor="currentPassword">Current Password: </label>
                        <input 
                            type="password" 
                            id="currentPassword" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            required 
                        />
                        <label htmlFor="newPassword">New Password: </label>
                        <input 
                            type="password" 
                            id="newPassword" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                        <input type="submit" value="Update Password"/>
                </form>

                {message && <p>{message}</p>}

                <div className="backButn">
                    <Link to="/menu">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
};

export default PasswordChange;
