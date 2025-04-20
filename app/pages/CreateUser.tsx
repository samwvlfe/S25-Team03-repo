import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CreateUser() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        userType: 'Driver',
        password: '',
        companyID: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await axios.post('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/admin/create-user', {...formData });
            alert('Profile created successfully');
        } catch (err) {
            alert('Error creating profile');
        }
    };

    return (
        <main>
            <div className="move-down">
                <div className="account-form">
                    <h2>Add a New User</h2>
                    <form className="application-form" onSubmit={handleCreate}>
                        <label>Full Name:</label>
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                        <label>Select User Type:</label>
                        <select name="userType" onChange={handleChange}>
                            <option value="Driver">Driver</option>
                            <option value="SponsorUser">Sponsor</option>
                            {user.usertype === 'Admin' && <option value="Admin">Admin</option>}
                        </select>
                        <label>Username:</label>
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                        <label>Password:</label>
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        {formData.userType === 'SponsorUser' && (
                            <div className="extra-field">
                                <label>Company ID:</label>
                                <input type="text" name="companyID" placeholder="Company ID" onChange={handleChange} />
                            </div>
                        )}
                        <input type="submit" value="Create Profile"/>
                    </form>
                </div>
                <div className="backButn">
                    <Link to="/menu" className="black-link">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    )
}