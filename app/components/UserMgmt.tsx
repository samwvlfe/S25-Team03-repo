import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { fetchTotalPoints} from '../../backend/api';

interface User {
    UserID: number;
    Name: string;
    Username: string;
    Email: string;
    UserType: string;
    CompanyID?: number | null;
}

interface UserMgmtProps {
    user?: User;
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
    const userType = user?.UserType;
    const userId = user?.UserID;

    return (
        <button onClick={() => {deleteUser(userType, userId)}}>Delete User</button>
    )
}

export function UserMgmt({ user }:UserMgmtProps) {
    const [points, setPoints] = useState<number | null>(null);
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (user?.UserType === "Driver") {
            fetchTotalPoints(user.UserID).then(setPoints);
        }
    }, [user]);

    return (
        <div className="user-management">
            <p>{ user?.Name }</p>
            {user?.UserType === "Driver" && <p>{points !== null ? points : "Loading..."}</p>}
            {(localUser.usertype === "SponsorUser" && (user?.UserType === "Driver" || user?.UserType === "SponsorUser")) && <DeleteButton user={user}/>}
            {localUser.usertype === "Admin" && <DeleteButton user={user}/>}
        </div>
    )
}