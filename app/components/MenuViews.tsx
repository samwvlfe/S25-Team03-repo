import React from 'react';

export function LandingView() {
    return (
        <>
            <div id="testDiv">

            </div>
        </>
    )
}

export function CreateMenu({ currentView }) {
    return (
        <div id="menuContent">
            {currentView == 'Landing' && <LandingView />}
        </div>
    )
}