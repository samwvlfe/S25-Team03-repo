import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

type ButtonProps = {
    changeView: Function
}

// Buttons for all driver actions.
export function DriverButtons({ changeView }: ButtonProps) {
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
            <li><Link to="/point-transaction">Point History</Link></li>
            <li id="pointsShop" onClick={() => navigate("/fake-store")}>Redeem Points</li>
            <li><Link to="/request-sponsor">Request Sponsor</Link></li>
            <li><Link to="/password-change">Change Password</Link></li>

        </>
    )
}

// Buttons for all sponsor actions.
export function SponsorButtons({ changeView }: ButtonProps) {
    const navigate = useNavigate();
    return (
        <>
            {/* <li id="viewRoster">View Roster</li> */}
            {/* <li id="poinstMgmt">Points Management</li> */}
            {/* <li id="catalogMgmt">Catalog Management</li> */}
            {/* <li id="sponsorApps">Review Applications</li> */}
            {/* <li id="switchView">Driver View</li> */}
            <li><Link to="/sponsor-catalog">Manage Product Catalog</Link></li>
            <li><Link to="/password-change">Change Password</Link></li>
            <li onClick={() => navigate("/review-sponsor-requests")} style={{ cursor: "pointer", textDecoration: "underline" }}> 
                Review Driver Requests </li>

        </>
    )
}

// Buttons for all admin actions.
export function AdminButtons({ changeView }: ButtonProps) {
    const navigate = useNavigate();
    return (
        <>
            <li id="viewUsers">
                <Link to="/users">
                    View Users
                </Link>
            </li>
            <li id="pointsMgmt">Points Management</li>
            <li id="adminApps">Review Applications</li>
            <li onClick={() => navigate("/create-product")} style={{ cursor: "pointer", textDecoration: "underline" }}>
                Add New Product
            </li>
            <li onClick={() => navigate("/add-company")} style={{ cursor: "pointer", textDecoration: "underline" }}>
                Add Company
            </li>
            <li id="viewLogs">View Audit Logs</li>
            <li>
                <Link to="/password-change">Change Password</Link>
            </li>
        </>
    )
}