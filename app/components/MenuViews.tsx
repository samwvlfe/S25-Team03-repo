import React, { useState, useEffect } from 'react';
import axios from 'axios';

// All relevant data for the ViewUsers segment.
interface ViewUsersProps {
    adminID: string;
}

interface User {
    UserID: number;
    Name: string;
    Username: string;
    Email: string;
    UserType: string;
    CompanyID?: number | null; // Only for Sponsors
}

function ViewUsers({ adminID }: ViewUsersProps) {
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
        : users.filter(user => user.UserType === roleFilter);

    return (
        <div className="view-container">
            <div className="view-header">
                <h2>View Users</h2>
            </div>

            <div className="view-extras">
                {/* Role Filter Dropdown */}
                <label>&#x1F50E; Filter by Role: </label>
                <select onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Driver">Drivers</option>
                    <option value="SponsorUser">Sponsors</option>
                </select>
            </div>

            <div className="view-content">
                {/* Error Message */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Users List */}
                <table border={1}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            {/*<th>Email</th>*/}
                            <th>Role</th>
                            {/*<th>Company ID (if Sponsor)</th>*/}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.UserID}>
                                    <td>{user.UserID}</td>
                                    <td>{user.Name}</td>
                                    <td>{user.Username}</td>
                                    {/*<td>{user.Email}</td>*/}
                                    <td>{user.UserType}</td>
                                    {/*<td>{user.UserType === "SponsorUser" ? user.CompanyID || "N/A" : "—"}</td>*/}
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
        </div>
    );
}

export function AdminView() {
    return (
        <>
            <div id="menuContent">
                <ViewUsers adminID='admin123'/>
            </div>
        </>
    )
}