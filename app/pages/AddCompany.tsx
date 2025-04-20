import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState('');
  const [pointsInfo, setPointsInfo] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(storedUser.usertype === 'Admin');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://xyoottz426.execute-api.us-east-1.amazonaws.com/api/add-company', {
        companyName,
        pointsInfo
      });

      setMessage(response.data.message);
      setCompanyName('');
      setPointsInfo('');
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || 'Error adding company. Please try again.'
      );
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <main>
      <div className="account-form">
        <h2>Add a New Company</h2>
        <form className="application-form" onSubmit={handleSubmit}>
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          <label>Points Info (optional):</label>
          <textarea
            value={pointsInfo}
            onChange={(e) => setPointsInfo(e.target.value)}
          ></textarea>

          <input type="submit" value="Add Company"/>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className="backButn">
        <Link to="/menu" className="black-link">{"<-- Back"}</Link>
      </div>
    </main>
  );
};

export default AddCompany;
