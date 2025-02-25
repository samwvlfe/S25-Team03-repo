import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplicationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        applicantName: '',
        applicantType: 'Driver',
        username: '',
        email: '',
        password: '',
        companyID: '',
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
        try {
            const response = await axios.post('http://localhost:2999/api/submit-application', formData); // Updated API URL
            alert(response.data.message);
            navigate('/apply-success');
        } catch (error) {
            alert('Error submitting application');
            console.error(error);
        }
    };

    return (
        <div>
            <form className="application-form" onSubmit={handleSubmit}>
                <input type="text" name="applicantName" placeholder="Full Name" required onChange={handleChange} />
                <select name="applicantType" onChange={handleChange}>
                    <option value="Driver">Driver</option>
                    <option value="Sponsor">Sponsor</option>
                </select>
                <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                {formData.applicantType === 'Sponsor' && (
                    <input type="text" name="companyID" placeholder="Company ID" onChange={handleChange} />
                )}
                <input type="submit" value="Submit Application" />
            </form>
        </div>
    );
}
