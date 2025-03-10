import React, { useState } from 'react';

interface User {
    username: string;
    usertype: string;
}

interface LandingViewProps {
    user: User;
}

interface CreateMenuProps {
    currentView: string,
    currentUser: User
}

function LandingView({ user }:LandingViewProps) {
    return (
        <>
            {/* <div id="landingView">
                <p>Hello, {user.username}!</p>
                <p>User Type: {user.usertype}</p>
            </div> */}
            <div className="userFuncContainer">
                <div className="widget">
                    <input type="text" placeholder="Enter # of points" />
                    <button type="button">Submit</button>
                </div>
                <div className="widget"></div>
                <div className="widget"></div>
                <div className="widget"></div>
            </div>
        </>
    )
}

function TestView() {
    return (
        <>
            <div id="testView">
                <p>Test view!</p>
            </div>
        </>
    )
}

export function CreateMenu({ currentView, currentUser }:CreateMenuProps) {
    return (
        <div id="menuContent">
            {currentView == 'landing' && <LandingView user={currentUser}/>}
            {currentView == 'test' && <TestView />}
        </div>
    )
}