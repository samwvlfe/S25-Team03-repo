import React, { useState } from 'react';
import axios from 'axios';

interface ProfileManagementProps {
    adminID: string;
}

export default function ProfileManagement({ adminID }: ProfileManagementProps) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        role: 'Driver',
        companyID: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        try {
            await axios.post('http://localhost:2999/api/admin/create-profile', { adminID, ...formData });
            alert('Profile created successfully');
        } catch (err) {
            alert('Error creating profile');
        }
    };

    return (
        <div>
            <h2>Manage Profiles</h2>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <select name="role" onChange={handleChange}>
                <option value="Driver">Driver</option>
                <option value="Sponsor">Sponsor</option>
            </select>
            {formData.role === 'Sponsor' && (
                <input type="text" name="companyID" placeholder="Company ID" onChange={handleChange} />
            )}
            <button onClick={handleCreate}>Create Profile</button>
        </div>
    );
}