import React, { useState, useEffect } from 'react';
import { toggleNav } from '../../script/toggle';
import { Eye } from '../components/BlobEye';

export default function Menu() {
    // Retrieve user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        toggleNav(); 
    }, []);

    return (
        <main className="menu-page">
            <div className="wall-area">
                <div className="big-window"/>
            </div>
            <div className="floor-level">
                <div className="obelisk" />
                <div className="desk-area">
                    <div className="blob-creature">
                        <Eye />
                    </div>
                    <div className="desk" />
                </div>
                <div className="plant" />
            </div>
        </main>
    );
}
