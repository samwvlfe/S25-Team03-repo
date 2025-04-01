import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


// Buttons for all driver actions.
export function DriverButtons() {
    const navigate = useNavigate();
    return (
        <>
            {/* Only display these if driver doesn't have a sponsor. */ }
            {/* <li id="createApp">Create Application</li>
            <li id="dViewApps">Review Applications</li> */}

            {/* Only display these if a driver is sponsored. */}
            {/* <li id="viewSponsor">View Sponsor</li>
            <li id="viewGuidelines">View Sponsor Guidelines</li>
            <li id="partnerMgmt">Manage Partnership</li> */}
            <li onClick={() => navigate("/point-transaction")}>Point History</li>
            <li onClick={() => navigate("/fake-store")}>Redeem Points</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
        </>
    )
}

// Buttons for all sponsor actions.
export function SponsorButtons() {
    const navigate = useNavigate();
    return (
        <>
            <li onClick={() => navigate("/users")} id="viewRoster">View Roster</li>
            {/* <li id="poinstMgmt">Points Management</li> */}
            {/* <li id="catalogMgmt">Catalog Management</li> */}
            {/* <li id="sponsorApps">Review Applications</li> */}
            {/* <li id="switchView">Driver View</li> */}
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/sponsor-catalog")}>Manage Product Catalog</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/review-sponsor-requests")}>Review Driver Requests </li>
        </>
    )
}

// Buttons for all admin actions.
export function AdminButtons() {
    const navigate = useNavigate();
    return (
        <>
            <li onClick={() => navigate("/users")}>Manage Users</li>
            <li>Add User</li>
            <li onClick={() => navigate("/review")}>Review Applications</li>
            <li>View Audit Logs</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/create-product")}>Add New Product</li>
            <li onClick={() => navigate("/add-company")}>Add Company</li>
        </>
    )
}