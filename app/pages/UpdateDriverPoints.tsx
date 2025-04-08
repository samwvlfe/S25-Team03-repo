import React, { useState } from 'react';
import { updatePoints } from '../../backend/api'; 
import { Link } from 'react-router-dom';


export default function DriverPointChangePage() {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) return <p>User not found. Please log in.</p>;

    let userData;
    try {
        userData = JSON.parse(userDataString);
    } catch (error) {
        return <p>Error reading user data.</p>;
    }

    // --- Form 1: Manual Point Update ---
    const [userDriverID, setUserDriverID] = useState("");
    const [pointsInc, setPointsInc] = useState("");
    const [reason, setReason] = useState("");

    const handlePointsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updatePoints(
            parseInt(userDriverID),
            parseInt(pointsInc),
            parseInt(userData.id),
            reason
        );

        if (success) {
            alert("Points updated successfully!");
            setUserDriverID("");
            setPointsInc("");
            setReason("");
        } else {
            alert("Failed to update points.");
        }
    };

    // --- Form 2: Predefined Actions ---
    const actions = [
        { label: "Safe Driving Award", value: "safe-driving", points: 10 },
        { label: "Late Delivery Penalty", value: "late-delivery", points: -5 },
        { label: "Violation Penalty", value: "violation", points: -20 },
        { label: "Customer Compliment", value: "compliment", points: 15 },
    ];

    const [actionDriverID, setActionDriverID] = useState("");
    const [selectedAction, setSelectedAction] = useState("-");

    const handleActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const action = actions.find(a => a.value === selectedAction);
        if (!action) return alert("Invalid action selected.");

        const success = await updatePoints(
            parseInt(actionDriverID),
            action.points,
            parseInt(userData.id),
            action.label // use label as the reason
        );

        if (success) {
            alert(`${action.label} applied successfully!`);
            setActionDriverID("");
            setSelectedAction(actions[0].value);
        } else {
            alert("Failed to apply action.");
        }
    };

    return (
        <div className="formPage">
            {/* Form 1: Manual Points Update */}
            <div className="formCard">
                <h2>Update Driver Points</h2>
                <form onSubmit={handlePointsSubmit}>
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
                            value={pointsInc}
                            onChange={(e) => setPointsInc(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Reason:
                        <br />
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Update Points</button>
                </form>
            </div>

            {/* Form 2: Predefined Action */}
            <div className="formCard">
                <h2>Quick Driver Actions</h2>
                <form onSubmit={handleActionSubmit}>
                    <label>
                        Driver ID:
                        <br />
                        <input
                            type="number"
                            value={actionDriverID}
                            onChange={(e) => setActionDriverID(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Choose an Action:
                        <br />
                        <select
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value)}
                            required
                        >
                            {actions.map((action) => (
                                <option key={action.value} value={action.value}>
                                    {action.label} ({action.points > 0 ? "+" : ""}{action.points} pts)
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <button type="submit">Apply Action</button>
                </form>
            </div>
            <div className="backButn">
                <Link to="/menu" className="black-link">{"<-- Back"}</Link>
            </div>
        </div>
    );
}
