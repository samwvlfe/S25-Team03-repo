import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';
import {DriverContent, SponsorContent, AdminContent} from '../components/MenuContent'
import { fetchTotalPoints} from '../../backend/api';

export default function Menu() {
    // Creating a state for tracking the maximized element.
    const [maximized, setMaximized] = useState<string | null>(null);

    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // get points and companyID only if user is driver
    const [totalPoints, setTotalPoints] = useState<number | null>(null);

    useEffect(() => {
        toggleNav(); 
        if (user.usertype === 'Driver' && user.id) {
            fetchTotalPoints(user.id).then(setTotalPoints);
        }
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
                {/* <p>Menu</p>
                <p>Welcome, {user.username}</p>
                <p>User Type: {user.usertype}</p>
                <div className="userFuncContainer">
                    <input type="text" placeholder="Enter # of points" />
                    <button type="button">Submit</button>
                </div> */}
                {/* <div className="userFuncContainer">
                    {user.usertype === 'Driver' && <DriverContent totalPoints={totalPoints} user={user} />}
                    {user.usertype === 'SponsorUser' && <SponsorContent user={user} />}
                    {user.usertype === 'Admin' && <AdminContent user={user} />}
                </div> */}
            </div>
        </main>
    );
}
