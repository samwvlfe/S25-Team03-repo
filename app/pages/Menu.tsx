import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import {DriverButtons, SponsorButtons, AdminButtons} from '../components/MenuButtons';
import { CreateMenu } from '../components/MenuViews';

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

            <CreateMenu />
        </main>
    );
}
