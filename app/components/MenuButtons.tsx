import React from 'react';
import { Link } from 'react-router-dom';

// Buttons for all driver actions.
export function DriverButtons() {
    return (
        <>
            {/* Only display these if driver doesn't have a sponsor. */ }
            <li id="createApp">Create Application</li>
            <li id="dViewApps">Review Applications</li>

            {/* Only display these if a driver is sponsored. */}
            <li id="viewSponsor">View Sponsor</li>
            <li id="viewGuidelines">View Sponsor Guidelines</li>
            <li id="partnerMgmt">Manage Partnership</li>
            <li id="poinstMgmt">View Points</li>
            <li id="pointsShop">Redeem Points</li>
        </>
    )
}

// Buttons for all sponsor actions.
export function SponsorButtons() {
    return (
        <>
            <li id="viewRoster">View Roster</li>
            <li id="poinstMgmt">Points Management</li>
            <li id="catalogMgmt">Catalog Management</li>
            <li id="sponsorApps">Review Applications</li>
            <li id="switchView">Driver View</li>
        </>
    )
}

// Buttons for all admin actions.
export function AdminButtons() {
    return (
        <>
            <li>
                <Link to="/users">View Users</Link>
            </li>
            <li id="pointsMgmt">Points Management</li>
            <li id="adminApps">Review Applications</li>
            <li id="viewLogs">View Audit Logs</li>
        </>
    )
}