import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        toggleNav(); 
        console.log(user);
    }, []);

    return (
        <main className="menu-page">
            <ul className="side-menu">
                {user.usertype == 'Driver' && <DriverButtons/>}
                {user.usertype == 'SponsorUser' && <SponsorButtons/>}
                {user.usertype == 'Admin' && <AdminButtons/>}
            </ul>
            <div id="menuContent">
                <div className="menu-info">
                    <h1>{user.usertype} Dashboard</h1>
                    <h3>Welcome, {user.username}.</h3>
                    <p>Use the sidebar to navigate your options.</p>
                </div>
            </div>
        </main>
    );
}
