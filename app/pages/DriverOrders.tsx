import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { updatePoints } from '../../backend/api'; 


interface Order {
  PurchaseID: number;
  DriverID: number;
  Timestamp: string;
  OrderItems: string;
  Amount: number;
  Status: string;
}

export default function DriverPointHistory() {
  const [order, setOrder] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const driverID = parseInt(user.id, 10);

    if (isNaN(driverID)) {
      setError('Invalid driver ID.');
      return;
    }

    axios.get('https://xyoottz426.execute-api.us-east-1.amazonaws.com/orderHistory/', { params: { driverID } })
      .then(response => {
        console.log("Order history received:", response.data);
        setOrder(response.data);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError('Error fetching order history');
      });
  }, []);

  const handleCancelOrder = async (purchaseID: number, driverID: number, amount: number) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;
  
    try {
        const response = await fetch(`https://xyoottz426.execute-api.us-east-1.amazonaws.com/deleteOrder/?PurchaseID=${purchaseID}`, {
            method: 'GET',
        });
        
        if (response.ok) {
            alert('Order cancelled successfully!');
            setOrder(prevData => prevData.filter(order => order.PurchaseID !== purchaseID));
            } 
        else {
            // Try to parse JSON safely, fallback to text
            let errorMessage = 'Failed to cancel order.';
            try {
                const data = await response.clone().json(); // clone() lets us safely try parsing
                errorMessage = data.error || errorMessage;
            } catch {
                const text = await response.text();
                errorMessage = text || errorMessage;
            }
            alert(errorMessage);
        }
    } catch (err) {
        console.error('Error cancelling order:', err);
        alert('An error occurred while cancelling the order.');
    }
    try{
      const success = await updatePoints(driverID, amount, 999, 'refund');
      if (success) {
          alert("Points refunded successfully!");
      }
      else{
          alert("Could not refund points");
      }
    } catch(err){

    }
  };
  

  return (
    <main>
      <div className="move-down">
        <h2>Point History</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="overflow-table">
          <table border={1}>
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Driver ID</th>
                <th>Timestamp</th>
                <th>Order</th>
                <th>Amount Spent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {order.length > 0 ? (
                order.map(row => (
                  <tr key={row.PurchaseID}>
                    <td>{row.PurchaseID}</td>
                    <td>{row.DriverID}</td>
                    <td>{row.Timestamp.slice(0, 10)}</td>
                    <td>{row.OrderItems}</td>
                    <th>{row.Amount}</th>
                    <td>{row.Status}</td>
                    <td>
                      <button onClick={() => handleCancelOrder(row.PurchaseID, row.DriverID, row.Amount)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No point history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="backButn">
        <Link to="/menu" className="black-link">{"<-- Back"}</Link>
      </div>
    </main>
  );
}
