import React, { useState, useEffect } from 'react';
import { AdminButtons, SponsorButtons, DriverButtons } from '../components/MenuButtons';
import { updatePoints, fetchTotalPoints} from '../../backend/api';
import { toggleNav } from '../../script/toggle';
import { Eye } from '../components/BlobEye';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [points, setPoints] = useState<number | null>(null);

    useEffect(() => {
        if (user.usertype === "Driver") {
            fetchTotalPoints(user.id).then(setPoints);
        }

        toggleNav(); 
    }, [user]);

    return (
        <main className="menu-page">
            <ul className="side-menu">
                {user.usertype === 'Driver' && <DriverButtons />}
                {user.usertype === 'SponsorUser' && <SponsorButtons />}
                {user.usertype === 'Admin' && <AdminButtons />}
            </ul>
            <div className="reception">
                <div className="wall-area">
                    <div className="small-window"/>
                    <div className="big-window"/>
                    <div className="small-window"/>
                </div>
                <div className='wall-decor'>
                    <div className="slime-diploma"/>
                    <div className="slime-wife"/>
                </div>
                <div className="floor-level">
                    <div className="obelisk" />
                    <div className="desk-area">
                        <span className="speech-bubble">
                            Hello, {user.username}! <br/>
                            Welcome to the {user.usertype} Dashboard!
                            {user.usertype === 'Driver' && <>
                                <br/> You currently have {points} points.
                            </>}
                        </span>
                        <div className="blob-creature">
                            <Eye />
                        </div>
                        <div className="desk" />
                    </div>
                    <div className="plant" />
                </div>
            </div>
        </main>
    );
}
