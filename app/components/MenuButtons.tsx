import React, { ButtonHTMLAttributes } from 'react';
import { useNavigate } from "react-router-dom";


// Buttons for all driver actions.
export function DriverButtons() {
    const navigate = useNavigate();
    return (
        <>
            <li onClick={() => navigate("/point-transaction")}>Point History</li>
            <li onClick={() => navigate("/fake-store")}>Redeem Points</li>
            <li onClick={() => navigate("/blackjack")}>Blackjack</li>
            <li onClick={() => navigate("/request-sponsor")}>Request Sponsor</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/driver-orders")}>View Orders</li>

        </>
    )
}

// Buttons for all sponsor actions.
export function SponsorButtons() {
    const navigate = useNavigate();
    return (
        <>
            <li onClick={() => navigate("/users")} id="viewRoster">View Roster</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/sponsor-catalog")}>Manage Product Catalog</li>
            <li onClick={() => navigate("/review")}>Review Applications</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/create-product")}>Add New Product</li>
            <li onClick={() => navigate("/leaderboard")}>View Driver Leaderboard</li>
            <li onClick={() => navigate("/review-sponsor-requests")}>Review Driver Requests </li>
            <li onClick={() => navigate("/driver-transactions")}>View Driver Transactions</li>
        </>
    )
}

// Buttons for all admin actions.
export function AdminButtons() {
    const navigate = useNavigate();
    return (
        <>
            <li onClick={() => navigate("/users")}>Manage Users</li>
            <li onClick={() => navigate("/review")}>Review Applications</li>
            <li onClick={() => navigate("/create-user")}>Add User</li>
            <li onClick={() => navigate("/password-change")}>Change Password</li>
            <li onClick={() => navigate("/create-product")}>Add New Product</li>
            <li onClick={() => navigate("/add-company")}>Add Company</li>
            <li onClick={() => navigate("/catalog-purchases")}>View Driver Transactions</li>
            <li>Generate Report</li>
        </>
    )
}