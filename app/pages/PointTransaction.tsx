import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface PointHistoryRow {
  TransactionID: number;
  DriverID: number;
  PointChange: number;
  EditorUserID: number;
  Timestamp: string;
  reason: string;
}

export default function DriverPointHistory() {
  const [history, setHistory] = useState<PointHistoryRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve user from localStorage and extract driverID
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const driverID = parseInt(user.id, 10);

    // Check if a valid driverID exists
    if (isNaN(driverID)) {
      setError('Invalid driver ID.');
      return;
    }

    // Call the backend API using axios. The endpoint expects driverID as a query parameter.
    axios.get('http://localhost:2999/pointHistory/', { params: { driverID } })
      .then(response => {
        console.log("Point history received:", response.data);
        setHistory(response.data);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError('Error fetching point history');
      });
  }, []);

  return (
    <main>
      <div className="move-down">
        <h2>Point History</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="overflow-table">
          <table border={1}>
            <thead>
              <tr>
                <th>TransactionID</th>
                <th>PointChange</th>
                <th>Editor's ID</th>
                <th>Timestamp</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map(row => (
                  <tr key={row.TransactionID}>
                    <td>{row.TransactionID}</td>
                    <td>{row.PointChange}</td>
                    <td>{row.EditorUserID}</td>
                    <td>{row.Timestamp}</td>
                    <td>{row.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>No point history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      <div className="backButn">
        <Link to="/menu" className="black-link">{"<-- Back"}</Link>
      </div>
    </main>
  );
}
