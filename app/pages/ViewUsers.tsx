import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [curUser, setCurUser] = useState<User | null>(null);
    const [roleFilter, setRoleFilter] = useState("All");
    const [error, setError] = useState('');
    const [selectedUserObj, setSelectedUserObj] = useState<{ 
        id: number, 
        username: string, 
        usertype: string, 
        companyID: number | null 
    } | null>(null); 

    // Determining who the local user is.
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch users from backend
    useEffect(() => {
        axios.get('http://localhost:2999/api/get-users', { params: { adminID } })
            .then(response => {
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

    // Filter users based upon whether the local user is an admin or sponsored user.
    const visibleUsers = localUser.usertype === 'SponsorUser'
        ? filteredUsers.filter(user => user.CompanyID === localUser.companyID)
        : filteredUsers;

    return (
        <main>
            <div className="move-down center-flex">
                <h2>View Users</h2>
                {/* Role Filter Dropdown */}
                <div className="filter">
                    <label>Filter by Role:</label>
                    <select onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Driver">Drivers</option>
                        <option value="SponsorUser">Sponsors</option>
                        {localUser.usertype === 'Admin' && <option value="Admin">Admins</option>}
                    </select>
                </div>
                <div className="view-users">
                    <div className="table-layout">
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
                                    <th>Assume Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleUsers.length > 0 ? (
                                    visibleUsers.map(user => (
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
                                            <td>
                                            <button onClick={(e) => {
                                                e.stopPropagation(); // prevent row toggle
                                                const simplified = {
                                                    id: user.UserID,
                                                    username: user.Username,
                                                    usertype: user.UserType,
                                                    companyID: user.CompanyID ?? null
                                                };

                                                // Save current user to 'previousUser'
                                                const currentUser = localStorage.getItem("user");
                                                if (currentUser) {
                                                    localStorage.setItem("previousUser", currentUser);
                                                }
                                                // Set new selected user
                                                localStorage.setItem("user", JSON.stringify(simplified));
                                                setSelectedUserObj(simplified);
                                                //make toggle button visible in nav-bar
                                                let toggleDiv = document.getElementById("toggleUser");
                                                if(toggleDiv){
                                                    toggleDiv.style.display = "block";
                                                }
                                                // navigate to menu
                                                navigate("/");
                                                
                                            }}>
                                                Select
                                            </button>

                                            </td>
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
                    <Link to="/menu" className="black-link">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
}