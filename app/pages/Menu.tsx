import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';
import { CreateMenu } from '../components/MenuViews';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Track current menu view.
    const [currentView, setCurrentView] = useState("Landing");

    // call func ONCE after doc loads 
    useEffect(() => {
        toggleNav(); 
    }, []);

    return (
        <main className="menu-page">
            <ul className="side-menu">
                {user.usertype == 'Driver' && <DriverButtons changeView={setCurrentView}/>}
                {user.usertype == 'SponsorUser' && <SponsorButtons changeView={setCurrentView}/>}
                {user.usertype == 'Admin' && <AdminButtons changeView={setCurrentView}/>}
            </ul>

            <CreateMenu currentView={currentView}/>
        </main>
    );
}
