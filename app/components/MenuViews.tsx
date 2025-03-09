import React from 'react';

function LandingView({ user }) {
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

export function CreateMenu({ currentView, currentUser }) {
    return (
        <div id="menuContent">
            {currentView == 'landing' && <LandingView user={currentUser}/>}
            {currentView == 'test' && <TestView />}
        </div>
    )
}