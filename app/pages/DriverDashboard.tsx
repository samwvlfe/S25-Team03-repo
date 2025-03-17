import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Driver Dashboard</h1>
            <button onClick={() => navigate("/fake-store")}>Redeem Points</button>
        </div>
    );
};

export default DriverDashboard;