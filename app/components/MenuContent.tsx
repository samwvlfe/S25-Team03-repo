import React, { useState } from 'react';
import { updatePoints } from '../../backend/api';

type User = {
    id: string;
    username: string;
    usertype: string;
    companyID: string;
};

type DriverProps = {
    totalPoints: number | null;
    user: User;
};

type GeneralProps = {
    user: User;
};

// Form component for updating driver points (used by sponsors and admins)
function DriverPointChangeForm() {
    const [userDriverID, setUserDriverID] = useState("");
    const [Points_inc, setPointsInc] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await updatePoints(parseInt(userDriverID), parseInt(Points_inc));

        if (success) {
            alert("Points updated successfully!");
            setUserDriverID(""); // Reset form fields
            setPointsInc("");
        } else {
            alert("Failed to update points.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Driver ID:
                <br />
                <input 
                    type="number" 
                    value={userDriverID} 
                    onChange={(e) => setUserDriverID(e.target.value)} 
                    required 
                />
            </label>
            <br />
            <label>
                Points:
                <br />
                <input 
                    type="number" 
                    value={Points_inc} 
                    onChange={(e) => setPointsInc(e.target.value)} 
                    required 
                />
            </label>
            <br />
            <button type="submit">Update Points</button>
        </form>
    );
}

// Driver content (ONLY Driver deals with viewing points)
export function DriverContent({ totalPoints, user }: DriverProps) {
    return (
        <div className="userFuncContainer">
            <div className="widget">
                <div className="widgetTitle">Driver Dashboard</div>
                <p>Username: {user.username}</p>
                <p>Points: {totalPoints !== null ? totalPoints : 'Loading...'}</p>
                <p>SponsorID: {user.companyID}</p>
                <p>Change Password Link Here</p>
            </div>
            <div className="widget">
                <div className="widgetTitle">Catalog</div>
                <p>link to catalog</p>
            </div>
        </div>
    );
}

// Sponsor content 
export function SponsorContent({ user }: GeneralProps) {
    return (
        <div className="userFuncContainer">
            <div className="widget">
                <div className="widgetTitle">Sponsor Dashboard</div>
                <p>Username: {user.username}</p>
                <p>User Type: {user.usertype}</p>
                <p>Company ID/Name: {user.companyID}</p>
            </div>
            <div className="widget">
                <div className="widgetTitle">Points Management</div>
                <DriverPointChangeForm />
            </div>
            <div className="widget">
                <div className="widgetTitle">Catalog Management</div>
                <p>** change catalog here **</p>
            </div>
        </div>
    );
}

// Admin content 
export function AdminContent({ user }: GeneralProps) {
    return (
        <div className="userFuncContainer">
            <div className="widget">
                <div className="widgetTitle">Admin Dashboard</div>
                <p>Username: {user.username}</p>
                <p>User Type: {user.usertype}</p>
            </div>
            <div className="widget">
                <div className="widgetTitle">User Management</div>
                <p>** Manage user accounts and permissions **</p>
            </div>
            <div className="widget">
                <div className="widgetTitle">Review Applications</div>
                <p>** put link here **</p>
            </div>
            <div className="widget">
                <div className="widgetTitle">Points Management</div>
                <DriverPointChangeForm />
            </div>
        </div>
    );
}
