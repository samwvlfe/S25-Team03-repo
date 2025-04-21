import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DriverPurchase {
  Username: string;
  TotalPoints: number;
  TransactionID: number;
  PointChange: number;
  Timestamp: string;
}

const DriverTransactions: React.FC = () => {
  const [data, setData] = useState<DriverPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDriverTransactions = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (!userData || typeof userData.companyID !== 'number') {
        setError('Invalid or missing companyID in local storage.');
        setLoading(false);
        return;
      }

      const companyID = userData.companyID;

      try {
        const response = await fetch('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/driver-transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyID }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Unknown server error');
        }

        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDriverTransactions();
  }, []);

  return (
    <main>
      <div className="move-down center-flex">
        <h2>Driver Transactions</h2>
        <div className="table-layout">
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {loading && <div>Loading...</div>}

          {!loading && data.length > 0 && (
            <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Username</th>
                  <th>Point Change</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.TransactionID}</td>
                    <td>{row.Username}</td>
                    <td>{row.PointChange}</td>
                    <td>{row.Timestamp.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="backButn">
          <Link to="/menu" className="black-link">{"<-- Back"}</Link>
        </div>
      </div>
    </main>
  );
};

export default DriverTransactions;
