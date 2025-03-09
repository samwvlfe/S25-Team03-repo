import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ViewUsersProps {
    adminID: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    companyID?: string; // Only for Sponsors
}

export default function ViewUsers({ adminID }: ViewUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [roleFilter, setRoleFilter] = useState("All");
    const [error, setError] = useState('');

    // Fetch users from backend
    useEffect(() => {
        axios.get('http://localhost:2999/api/get-users', { params: { adminID } })
            .then(response => {
                console.log("Users received:", response.data); // Debug log
                setUsers(response.data);
            })
            .catch(err => {
                console.error("API Error:", err);
                setError('Error fetching users');
            });
    }, [adminID]);

    // Filter users based on selected role
    const filteredUsers = roleFilter === "All" 
        ? users 
        : users.filter(user => user.role === roleFilter);

    return (
        <div>
            <h2>View Users</h2>

            {/* Role Filter Dropdown */}
            <label>Filter by Role:</label>
            <select onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Driver">Drivers</option>
                <option value="Sponsor">Sponsors</option>
            </select>

            {/* Error Message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Users List */}
            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Company ID (if Sponsor)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.role === "Sponsor" ? user.companyID || "N/A" : "—"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}