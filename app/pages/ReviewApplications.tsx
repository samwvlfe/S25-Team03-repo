import * as React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

// Define the expected shape of an Application object
interface Application {
    ApplicationID: number;
    ApplicantName: string;
    ApplicantType: string;
    Username: string;
    Email: string;
    ApplicationStatus: string;
}

export default function ReviewApplications() {
    const [applications, setApplications] = React.useState<Application[]>([]);

    // Fetch applications from backend
    React.useEffect(() => {
        axios.get('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/get-applications')
            .then(response => {setApplications(response.data)})
            .catch(error => console.error('Error fetching applications:', error));
    }, []);

    // Function to update application status
    const updateStatus = (applicationID: number, status: 'Approved' | 'Rejected') => {
        axios.post('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/update-application-status', { applicationID, status })
            .then(() => {
                alert(`Application ${status}`);
                setApplications(applications.map(app => 
                    app.ApplicationID === applicationID ? { ...app, ApplicationStatus: status } : app
                ));
            })
            .catch(error => console.error('Error updating status:', error));
    };

    return (
        <main>
            <div className="move-down center-flex">
                <h2>Review Applications</h2>
                <div className="table-layout">
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.ApplicationID}>
                                    <td>{app.ApplicationID}</td>
                                    <td>{app.ApplicantName}</td>
                                    <td>{app.ApplicantType}</td>
                                    <td>{app.Username}</td>
                                    <td>{app.Email}</td>
                                    <td>{app.ApplicationStatus}</td>
                                    <td>
                                        {app.ApplicationStatus === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(app.ApplicationID, 'Approved')}>&#10003; Approve</button>
                                                <button onClick={() => updateStatus(app.ApplicationID, 'Rejected')}>&#x2717; Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="backButn">
                    <Link to="/menu" className="black-link">{"<-- Back"}</Link>
                </div>
            </div>
        </main>
    );
}
