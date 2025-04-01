import React, {useState, useEffect} from 'react';
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

    return (
        <div className="points-management">
            <h2>Points Management</h2>
            <form onSubmit={handleSubmit}>
                <label>Points:</label>
                <input type="number" value={pointsInc} onChange={(event) => {setPointsInc(event.target.value)}} required/>
                <label>Reason:</label>
                <input type="text" value={reason} onChange={(event) => {setReason(event.target.value)}} required/>
                <input type="submit" value="Update Points"/>
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
            <h2>User Options</h2>
            <p>Selected user: { user?.Name }</p>
            <div className="user-info">
                {user.UserType === "Driver" && <p>Points: {points !== null ? points : "Loading..."}</p>}
            </div>
            {user.UserType === "Driver" && <PointsMgmt user={user} localUser={localUser}/>}
            {(localUser.usertype === "SponsorUser" && (user.UserType === "Driver" || user.UserType === "SponsorUser")) && <DeleteButton user={user}/>}
            {localUser.usertype === "Admin" && <DeleteButton user={user}/>}
        </div>
    )
}