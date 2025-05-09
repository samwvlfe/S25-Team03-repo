import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface PurchaseRecord {
  TransactionID: number;
  DriverID: number;
  PointChange: number;
  EditorUserID: number;
  Timestamp: string;
  Reason: string;
}

const CatalogPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/catalog-purchases', {
        method: 'GET',
        mode: 'cors',
        headers: {
      'Content-Type': 'application/json',
      },
      });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Server error');
        }

        setPurchases(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <main>
      <div className="move-down center-flex">
        <h2>Catalog Purchases</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {loading && <div>Loading...</div>}
        <div className="table-layout">
          {!loading && purchases.length > 0 && (
            <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Driver ID</th>
                  <th>Point Change</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((record, index) => (
                  <tr key={index}>
                    <td>{record.TransactionID}</td>
                    <td>{record.DriverID}</td>
                    <td>{record.PointChange}</td>
                    <td>{record.Timestamp.slice(0, 10)}</td>
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

export default CatalogPurchases;
