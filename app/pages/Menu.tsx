import React, { useState, useEffect } from 'react';
import { CreateMenu } from '../components/MenuViews';
import { toggleNav } from '../../script/toggle';
// import different html elements for each usertype
import { DriverButtons, SponsorButtons, AdminButtons } from '../components/MenuButtons';
import { DriverContent, SponsorContent, AdminContent } from '../components/MenuContent';
// functions to GET data
import { fetchTotalPoints} from '../../backend/api';


export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [currentView, setCurrentView] = useState('landing');

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
                {user.usertype == 'Driver' && <DriverButtons changeView={setCurrentView}/>}
                {user.usertype == 'SponsorUser' && <SponsorButtons changeView={setCurrentView}/>}
                {user.usertype == 'Admin' && <AdminButtons changeView={setCurrentView}/>}
            </ul>
            <div className="userFuncContainer">
                {user.usertype === 'Driver' && <DriverContent totalPoints={totalPoints} user={user} />}
                {user.usertype === 'SponsorUser' && <SponsorContent user={user} />}
                {user.usertype === 'Admin' && <AdminContent user={user} />}
            </div>
        </main>
    );
}
