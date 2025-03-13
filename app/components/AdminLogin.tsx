/*import React, { useState } from 'react';
import axios from 'axios';

interface AdminLoginProps {
    onVerified: (adminID: string) => void;
}

export default function AdminLogin({ onVerified }: AdminLoginProps) {
    const [adminID, setAdminID] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:2999/api/admin/verify', { adminID });
            alert(response.data.message);
            onVerified(adminID); 
        } catch (err) {
            setError('Invalid AdminID');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter Admin ID:</label>
                <input
                    type="text"
                    value={adminID}
                    onChange={(e) => setAdminID(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}*/