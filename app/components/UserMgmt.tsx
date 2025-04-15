import React, {useState, useEffect, ReactElement} from 'react';
import axios from 'axios';
import { updatePoints, fetchTotalPoints} from '../../backend/api';

interface User {
    UserID: number;
    Name: string;
    Username: string;
    Email: string;
    UserType: string;
    CompanyID?: number | null;
}

interface LocalUser {
    id: number;
    username: string;
    usertype: string;
    pass: string;
}

interface UserMgmtProps {
    user: User;
}

interface PointsMgmtProps {
    user: User;
    localUser: LocalUser;
}

const deleteUser = async (userType: string | undefined, userId: number | undefined) => {
    try {
        console.log(`${userId} ${userType}`);
        const response = await axios.delete(`http://localhost:2999/api/admin/delete-user/${userType}/${userId}`);
        alert(response.data.message);
    } catch (error) {
        alert(error);
    }
}

function DeleteButton({ user }:UserMgmtProps) {
    const userType = user.UserType;
    const userId = user.UserID;

    return (
        <button className='delete-button' onClick={() => {deleteUser(userType, userId)}}>Delete User</button>
    )
}

function PointsMgmt({ user, localUser }:PointsMgmtProps) {
    // Form 1: Specific point management.
    const [pointsInc, setPointsInc] = useState<string>('');
    const [reason, setReason] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const result = await updatePoints(user.UserID, parseInt(pointsInc), localUser.id, reason);

        if (result) {
            alert("Points successfully updated.");
            // Resetting current values.
            setPointsInc('');
            setReason('');
        } else {
            alert("Failed to update points.");
        }
    };

    // Form 2: Quick actions.
    const actions = [
        { label: "Safe Driving Award", value: "safe-driving", points: 10 },
        { label: "Late Delivery Penalty", value: "late-delivery", points: -5 },
        { label: "Violation Penalty", value: "violation", points: -20 },
        { label: "Customer Compliment", value: "compliment", points: 15 },
    ];
    
    const [selectedAction, setSelectedAction] = useState("-");

    const handleActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const action = actions.find(a => a.value === selectedAction);
        if (!action) return alert("Invalid action selected.");

        const success = await updatePoints(
            user.UserID,
            action.points,
            localUser.id,
            action.label // use label as the reason
        );

        if (success) {
            alert(`${action.label} applied successfully!`);
            setSelectedAction(actions[0].value);
        } else {
            alert("Failed to apply action.");
        }
    };

    return (
        <div className="points-management">
            <h2>Points Management</h2>
            <form className="inline-form" onSubmit={handleSubmit}>
                <label>Points:</label>
                <input type="number" value={pointsInc} onChange={(event) => {setPointsInc(event.target.value)}} required/>
                <label>Reason:</label>
                <input type="text" value={reason} onChange={(event) => {setReason(event.target.value)}} required/>
                <input type="submit" value="Update Points"/>
            </form>
            <form className="inline-form" onSubmit={handleActionSubmit}>
                <label>Choose an action:</label>
                <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} required>
                    {actions.map((action) => (
                        <option key={action.value} value={action.value}>
                            {action.label} ({action.points > 0 ? "+" : ""}{action.points} pts)
                        </option>
                    ))}
                </select>
                <input type="submit" value="Apply Action"/>
            </form>
        </div>
    )
}

// Creating the interface for sponsors.
interface Sponsor {
    CompanyID: number;
    CompanyName: string;
}

// This section will allow an admin to change a driver's affiliated sponsor.
function SponsorMgmt({ user, localUser }:PointsMgmtProps) {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [selectedCompanyID, setSelectedCompanyID] = useState('');

    // Fetching the list of sponsors.
    useEffect(() => {
        const fetchSponsors = async () => {
          try {
            const res = await axios.get('http://localhost:2999/api/get-sponsors');
            setSponsors(res.data);
          } catch (error) {
            console.error('Error fetching sponsors:', error);
          }
        };
    
        fetchSponsors();
    }, []);

    // Function to handle the change of a sponsor.
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.patch('http://localhost:2999/api/sponsor-update', {
                driverID: user.UserID,
                sponsorID: parseInt(selectedCompanyID)
            });

            alert("Sponsor was changed successfully!");
        } catch (error) {
            alert("Could not set sponsor.");
            console.error('Error changing sponsors:', error);
        }
    }

    let sponsorDisplay:ReactElement = <p>User is not partnered!</p>;

    if (user.CompanyID != null) {
        sponsorDisplay = <p>{user.CompanyID}</p>;
    }

    return (
        <div className="sponsor-mangement">
            {sponsorDisplay}
            <form className="inline-form" onSubmit={handleSubmit}>
                <label>Select Sponsor:</label>
                <select
                    value={selectedCompanyID}
                    onChange={(e) => setSelectedCompanyID(e.target.value)}
                    required
                >
                    <option value="">-- Choose a Sponsor --</option>
                    {sponsors.map((sponsor) => (
                    <option key={sponsor.CompanyID} value={sponsor.CompanyID}>
                        {sponsor.CompanyName}
                    </option>
                    ))}
                </select>
                <input type="submit" value="Change Sponsor" />
            </form>
        </div>
    )
}

export function UserMgmt({ user }:UserMgmtProps) {
    const [points, setPoints] = useState<number | null>(null);
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user.UserType === "Driver") {
            fetchTotalPoints(user.UserID).then(setPoints);
        }
    }, [user]);

    return (
        <div className="user-management">
            <div className="menu-container">
                <h2 className="menu-header">User Information</h2>
                <div className="menu-sector">
                    <p>Selected user: { user?.Name }</p>
                    {user.UserType === "Driver" && <p>Points: {points !== null ? points : "Loading..."}</p>}
                </div>
            </div>
            {user.UserType === "Driver" && <SponsorMgmt user={user} localUser={localUser}/>}
            {user.UserType === "Driver" && <PointsMgmt user={user} localUser={localUser}/>}
            {(localUser.usertype === "SponsorUser" && user.UserType === "Driver") && <DeleteButton user={user}/>}
            {(localUser.usertype === "Admin" && user.UserType != "Admin") && <DeleteButton user={user}/>}
        </div>
    )
}