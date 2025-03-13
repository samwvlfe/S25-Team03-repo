/*import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import ProfileManagement from '../components/ProfileManagement';

export default function AdminDashboard() {
    const [verifiedAdminID, setVerifiedAdminID] = useState<string | null>(null);

    return (
        <main>
            {verifiedAdminID ? (
                <ProfileManagement adminID={verifiedAdminID} />
            ) : (
                <AdminLogin onVerified={setVerifiedAdminID} />
            )}
        </main>
    );
}*/