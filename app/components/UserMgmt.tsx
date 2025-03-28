import React, {useState, useEffect} from 'react';
import axios from 'axios';

interface UserMgmtProps {
    user?: User;
}

interface User {
    UserID: number;
    Name: string;
    Username: string;
    Email: string;
    UserType: string;
    CompanyID?: number | null;
}

export function UserMgmt({ user }:UserMgmtProps) {
    let test = axios.get('http://localhost:2999/getTotalPoints');
    console.log("test");

    return (
        <div className="user-management">
            <p>{ user.UserID }</p>
        </div>
    )
}