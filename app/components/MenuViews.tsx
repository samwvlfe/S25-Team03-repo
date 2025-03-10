import React from 'react';

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
            <div id="landingView">
                <p>Hello, {user.username}!</p>
                <p>User Type: {user.usertype}</p>
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