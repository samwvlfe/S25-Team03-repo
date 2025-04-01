import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularLoading from '../components/CircularLoading';

interface Sponsor {
  CompanyID: number;
  CompanyName: string;
}

export default function SponsorRequestForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedCompanyID, setSelectedCompanyID] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get('http://localhost:2999/api/get-sponsors');
        setSponsors(res.data);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      }
    };

    fetchSponsors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:2999/api/request-sponsor', {
        driverID: user.id,
        sponsorCompanyID: selectedCompanyID
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Sponsor request failed:', err);
      setMessage('Error sending request to sponsor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {loading && <CircularLoading />}
      <div className="account-form">
        <form onSubmit={handleSubmit}>
          <h2>Request a Sponsor Company</h2>
          <label>Select Sponsor:</label>
          <select
            value={selectedCompanyID}
            onChange={(e) => setSelectedCompanyID(e.target.value)}
            required
          >
            <option value="">-- Choose a Sponsor --</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor.CompanyID} value={sponsor.CompanyID}>
                {sponsor.CompanyName}
              </option>
            ))}
          </select>
          <button type="submit">Submit Request</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
}
