import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
}

export default function ViewUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:2999/api/get-users')
            .then(response => setUsers(response.data))
            .catch(err => setError('Error fetching users'));
    }, []);

    return (
        <main>
            <h2>All Users</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
