import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserMgmt } from '../components/UserMgmt';
import {fetchTotalPoints} from '../../backend/api';

interface ViewUsersProps {
    adminID: string;
}

interface User {
    UserID: number;
    Name: string;
    Username: string;
    Email: string;
    UserType: string;
    CompanyID?: number | null;
}

export default function ViewUsers({ adminID }: ViewUsersProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [curUser, setCurUser] = useState<User | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [error, setError] = useState('');

    // Fetch users from backend
    useEffect(() => {
        axios.get('http://localhost:2999/api/get-users', { params: { adminID } })
            .then(response => {
                console.log("Users received:", response.data);

                const normalizedUsers = response.data.map((user: any) => ({
                    UserID: user.DriverID || user.AdminID || user.SponsorUserID,
                    Name: user.Name,
                    Username: user.Username,
                    UserType: user.UserType,
                    CompanyID: user.CompanyID ?? null
                }));

                setUsers(normalizedUsers);
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
        <main>
            <div className="move-down">
                <div className="view-users">
                    <div className="table-layout">
                        <h2>View Users</h2>
                        {/* Role Filter Dropdown */}
                        <div className="filter">
                            <label>Filter by Role:</label>
                            <select onChange={(e) => setRoleFilter(e.target.value)}>
                                <option value="All">All</option>
                                <option value="Driver">Drivers</option>
                                <option value="SponsorUser">Sponsors</option>
                                <option value="Admin">Admins</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* Users List */}
                        <table border={1} id="viewUsers">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Company ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.UserID} onClick={() => {
                                            if (curUser === null || curUser != user) {
                                                setCurUser(user);
                                            } else {
                                                setCurUser(null);
                                            }
                                        }}>
                                            <td>{user.UserID}</td>
                                            <td>{user.Name}</td>
                                            <td>{user.Username}</td>
                                            <td>{user.UserType}</td>
                                            <td>{user.CompanyID != null ? user.CompanyID : "—"}</td>
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
                    {(curUser) && <UserMgmt user={curUser}/>}
                </div>
                <div className="backButn">
                    <Link to="/menu">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
}