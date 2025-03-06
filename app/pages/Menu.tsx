import React, { useEffect } from 'react';
import { toggleNav } from '../../script/toggle';

import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // call func ONCE after doc loads 
    useEffect(() => {
        toggleNav(); 
    }, []);

    return (
        <main className="menu-page">
            <ul className="side-menu">
                {user.usertype == 'Driver' && <DriverButtons />}
                {user.usertype == 'Sponsor' && <SponsorButtons />}
                {user.usertype == 'Admin' && <AdminButtons />}
            </ul>

            <div className="menu-content">
                <p>Menu</p>
                <p>Welcome, {user.username}</p>
                <p>User Type: {user.usertype}</p>
            </div>
        </main>
    );
}
