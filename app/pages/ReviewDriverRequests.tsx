import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


interface Request {
  RequestID: number;
  DriverID: number;
  SponsorCompanyID: number;
  RequestDate: string;
  Status: string;
  Username: string;
}

const ReviewDriverRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const sponsor = JSON.parse(localStorage.getItem("user") || "{}");
    if (!sponsor.companyID) return;

    axios
      .get(`http://44.200.67.186:2999/api/sponsor/driver-requests/${sponsor.companyID}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to fetch requests", err));
  }, []);

  const handleDecision = (requestID: number, driverID: number, decision: string) => {
    axios
      .post("http://44.200.67.186:2999/api/sponsor/handle-request", {
        requestID,
        driverID,
        decision
      })
      .then(() => {
        setRequests((prev) => prev.filter((r) => r.RequestID !== requestID));
      })
      .catch((err) => console.error("Failed to update request", err));
  };

  return (
    <div>
      <h2>Review Driver Sponsorship Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Driver Username</th>
            <th>Request Date</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.RequestID}>
              <td>{r.Username}</td>
              <td>{new Date(r.RequestDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDecision(r.RequestID, r.DriverID, "Approved")}>Approve</button>
                <button onClick={() => handleDecision(r.RequestID, r.DriverID, "Rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
            {/* Back button */}
      <div className="backButn" style={{ marginTop: "20px" }}>
        <Link to="/menu">{"<-- Back"}</Link>
      </div>
    </div>
  );
};

export default ReviewDriverRequests;
