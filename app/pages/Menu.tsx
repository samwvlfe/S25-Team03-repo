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
                {user.usertype == 'SponsorUser' && <SponsorButtons />}
                {user.usertype == 'Admin' && <AdminButtons />}
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
