import React from 'react';

export function LandingView() {
    return (
        <>
            <div id="testDiv">
                <p>Testing Stuff!</p>
            </div>
        </>
    )
}

export function CreateMenu({ currentView }) {
    return (
        <div id="menuContent">
            {currentView == 'test' && <LandingView />}
        </div>
    )
}