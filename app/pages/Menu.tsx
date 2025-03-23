import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';
import { AdminView } from '../components/MenuViews';

export default function Menu() {
    // Creating a state for tracking the maximized element.
    const [maximized, setMaximized] = useState<string | null>(null);

    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // call func ONCE after doc loads 
    useEffect(() => {
        toggleNav(); 
    }, []);

    return (
        <main className="menu-page">
            {user.usertype === 'Admin' && <AdminView />}

            {/*
            <div id="menuContent">
                <p>Menu</p>
                <p>Welcome, {user.username}</p>
                <p>User Type: {user.usertype}</p>
                <div className="userFuncContainer">
                    <input type="text" placeholder="Enter # of points" />
                    <button type="button">Submit</button>
                </div>
            </div> */}
        </main>
    );
}
