import React, { useState } from 'react';
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
            await axios.post('http://localhost:2999/api/admin/create-user', {...formData });
            alert('Profile created successfully');
        } catch (err) {
            alert('Error creating profile');
        }
    };

    return (
        <main>
            <div className="account-form">
                <form className="application-form" onSubmit={handleCreate}>
                    <label>Full Name:</label>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                    <label>Select User Type:</label>
                    <select name="userType" onChange={handleChange}>
                        <option value="Driver">Driver</option>
                        <option value="Sponsor">Sponsor</option>
                        {user.usertype === 'Admin' && <option value="Admin">Admin</option>}
                    </select>
                    <label>Username:</label>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                    {formData.userType === 'Sponsor' && (
                        <input type="text" name="companyID" placeholder="Company ID" onChange={handleChange} />
                    )}
                    <input type="submit" value="Create Profile"/>
                </form>
            </div>
        </main>
    )
}