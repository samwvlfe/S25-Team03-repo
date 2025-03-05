import React from 'react';

// Buttons for all driver actions.
function DriverButtons() {
    return (
        <>
            {/* Only display these if driver doesn't have a sponsor. */ }
            <button id="createApp">Create Application</button>
            <button id="dViewApps">Review Applications</button>

            {/* Only display these if a driver is sponsored. */}
            <button id="viewSponsor">View Sponsor</button>
            <button id="viewGuidelines">View Sponsor Guidelines</button>
            <button id="partnerMgmt">Manage Partnership</button>
            <button id="pointsShop">Redeem Points</button>
        </>
    )
}

// Buttons for all sponsor actions.
function SponsorButtons() {
    return (
        <>
            <button id="viewRoster">View Roster</button>
            <button id="poinstMgmt">Points Management</button>
            <button id="catalogMgmt">Catalog Management</button>
            <button id="sponsorApps">Review Applications</button>
            <button id="switchView">Driver View</button>
        </>
    )
}

// Buttons for all admin actions.
function AdminButtons() {
    return (
        <>
            <button id="viewUsers">View Users</button>
            <button id="pointsMgmt">Points Management</button>
            <button id="adminApps">Review Applications</button>
            <button id="viewLogs">View Audit Logs</button>
        </>
    )
}