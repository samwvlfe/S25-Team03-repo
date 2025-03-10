import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';
import { CreateMenu } from '../components/MenuViews';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Track current menu view.
    const [currentView, setCurrentView] = useState('landing');

    // call func ONCE after doc loads 
    useEffect(() => {
        toggleNav(); 
    }, []);

    return (
        <main className="menu-page">
            <ul className="side-menu">
                {user.usertype == 'Driver' && <DriverButtons changeView={setCurrentView}/>}
                {user.usertype == 'Sponsor' && <SponsorButtons changeView={setCurrentView}/>}
                {user.usertype == 'Admin' && <AdminButtons changeView={setCurrentView}/>}
            </ul>

            <div id="menuContent">
                <p>Menu</p>
                <p>Welcome, {user.username}</p>
                <p>User Type: {user.usertype}</p>
                {/* <div className="userFuncContainer">
                    <input type="text" placeholder="Enter # of points" />
                    <button type="button">Submit</button>
                </div> */}
            </div>
        </main>
    );
}
