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
        <div className="view-container maximized">
            <div className="view-header">
                <h2>View Users</h2>
                <button>⛶</button>
            </div>

            <div className="view-extras">
                {/* Role Filter Dropdown */}
                <label>&#x1F50E; Filter by Role: </label>
                <select onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Driver">Drivers</option>
                    <option value="Sponsor">Sponsors</option>
                </select>
            </div>

            <div className="view-content">
                {/* Error Message */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Users List */}
                <table border={1} className="fixed-table">
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

// All relevant code for viewing the applications.
interface Application {
    ApplicationID: number;
    ApplicantName: string;
    ApplicantType: string;
    Username: string;
    Email: string;
    ApplicationStatus: string;
}

function ViewApplications() {
    const [applications, setApplications] = React.useState<Application[]>([]);

    // Fetch applications from backend
    React.useEffect(() => {
        axios.get('http://localhost:2999/api/get-applications')
            .then(response => {setApplications(response.data)})
            .catch(error => console.error('Error fetching applications:', error));
    }, []);

    // Function to update application status
    const updateStatus = (applicationID: number, status: 'Approved' | 'Rejected') => {
        axios.post('http://localhost:2999/api/update-application-status', { applicationID, status })
            .then(() => {
                alert(`Application ${status}`);
                setApplications(applications.map(app => 
                    app.ApplicationID === applicationID ? { ...app, ApplicationStatus: status } : app
                ));
            })
            .catch(error => console.error('Error updating status:', error));
    };

    // Creating minimized indicators for the application status.
    const Approved = () => {
        return (
            <div className="status">
                <div className="approved circle" />
            </div>
        )
    }

    const Pending = () => {
        return (
            <div className="status">
                <div className="pending circle" />
            </div>
        )
    }

    const Rejected = () => {
        return (
            <div className="status">
                <div className="rejected circle" />
            </div>
        )
    }

    return (
        <div className="view-container">
            <div className="view-header">
                <h2>Review Applications</h2>
                <button>⛶</button>
            </div>
            <div className="view-content">
                <table border={1} className="applications">
                    <thead>
                        <tr>
                            {/*<th>ID</th>*/}
                            <th>Name</th>
                            <th>Type</th>
                            <th>Username</th>
                            {/*<th>Email</th>*/}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.ApplicationID}>
                                {/*<td>{app.ApplicationID}</td>*/}
                                <td>{app.ApplicantName}</td>
                                <td>{app.ApplicantType}</td>
                                <td>{app.Username}</td>
                                {/*<td>{app.Email}</td>*/}
                                <td>
                                    {app.ApplicationStatus === 'Pending' && <Pending />}
                                    {app.ApplicationStatus === 'Approved' && <Approved />}
                                    {app.ApplicationStatus === 'Rejected' && <Rejected />}
                                    {/*app.ApplicationStatus*/}
                                </td>
                                <td>
                                    {app.ApplicationStatus === 'Pending' && (
                                        <div className="status">
                                            <button onClick={() => updateStatus(app.ApplicationID, 'Approved')}>&#10003; {/* Approve */}</button>
                                            <button onClick={() => updateStatus(app.ApplicationID, 'Rejected')}>&#x2717; {/* Reject */}</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
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
                <ViewUsers adminID='admin123' />
                <ViewApplications />
            </div>
        </>
    )
}