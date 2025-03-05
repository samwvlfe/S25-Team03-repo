import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoading from '../components/CircularLoading';

export default function ApplicationForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        applicantName: '',
        applicantType: 'Driver',
        username: '',
        email: '',
        password: '',
        companyID: '',
        adminID: '',
        applicationStatus: 'Pending', // Default to Pending
        submissionDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format for MySQL
        reviewedByAdminID: null,
        reviewedBySponsorID: null,
        reviewDate: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:2999/api/submit-application', formData); 
            alert(response.data.message);
            navigate('/apply-success');
        } catch (error) {
            alert('Error submitting application');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="account-form">
                {loading && <CircularLoading />}

                <form className="application-form" onSubmit={handleSubmit}>
                    <img src="/media/default-alien.svg"/>

                    <label>Full Name:</label>
                    <input type="text" name="applicantName" placeholder="Full Name" required onChange={handleChange} />
                    <label>I am a:</label>
                    <select name="applicantType" onChange={handleChange}>
                        <option value="Driver">Driver</option>
                        <option value="Sponsor">Sponsor</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <label>Username:</label>
                    <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    {formData.applicantType === 'Sponsor' && (
                        <div>
                            <label>Company ID:</label>
                            <input type="text" name="companyID" placeholder="Company ID" onChange={handleChange} />
                        </div>
                    )}
                    {formData.applicantType === 'Admin' && (
                        <div>
                            <label>Admin ID:</label>
                            <input type="text" name="adminID" placeholder="Admin ID" required onChange={handleChange} />
                        </div>
                    )}
                    <input type="submit" value="Submit Application" />
                </form>
            </div>
        </main>
    );
}
