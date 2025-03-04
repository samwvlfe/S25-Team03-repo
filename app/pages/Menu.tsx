import React, { useEffect } from 'react';
import { toggleNav } from '../../script/toggle';

export default function Menu() {
    // Retrieve user info from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // call func ONCE after doc loads 
    useEffect(() => {
        toggleNav(); 
    }, []); 

    return (
        <div>
            <p>Menu</p>
            <p>Welcome, {user.username}</p>
            <p>User Type: {user.usertype}</p>
        </div>
    );
}
