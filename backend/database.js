const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 2999;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 't3db-instance.cmypylkqlfup.us-east-1.rds.amazonaws.com',
    user: 't3admin',
    password: 'JlziWBbT4LmgEEbJsCwW',
    database: 'GoodDriverIncentiveT3',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Amazon RDS MySQL database');
    }
});

// Table name for the about page
const aboutTable = 'AboutPage';

// Get the latest about page data
app.get('/api/about', (req, res) => {
    db.query(`SELECT * FROM ${aboutTable} ORDER BY release_date DESC LIMIT 1`, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed', details: err });
        } else {
            res.json(results[0]); // Returns the latest sprint data
        }
    });
});

// Add new about page data
app.post('/api/about', (req, res) => {
    const { team_number, version_number, release_date, product_name, product_description } = req.body;
    const query = `INSERT INTO ${aboutTable} (team_number, version_number, release_date, product_name, product_description) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Database insert failed', details: err });
        } else {
            res.status(201).json({ message: 'About page updated successfully', id: result.insertId });
        }
    });
});

// Update existing about page data
app.put('/api/about/:id', (req, res) => {
    const id = req.params.id;
    const { team_number, version_number, release_date, product_name, product_description } = req.body;
    const query = `UPDATE ${aboutTable} SET team_number=?, version_number=?, release_date=?, product_name=?, product_description=? WHERE id=?`;

    db.query(query, [team_number, version_number, release_date, product_name, product_description, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Database update failed', details: err });
        } else {
            res.json({ message: 'About page data updated successfully' });
        }
    });
});

// Submitting Application
app.post('/api/submit-application', (req, res) => {
    const { applicantName, applicantType, username, email, password, companyID } = req.body;

    if (!applicantName || !applicantType || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO Applications (ApplicantName, ApplicantType, Username, Email, PasswordHash, CompanyID, ApplicationStatus, SubmissionDate)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    db.query(query, [applicantName, applicantType, username, email, password, companyID || null], (err, result) => {
        if (err) {
            console.error('Database insert failed:', err);
            res.status(500).json({ error: 'Database insert failed', details: err });
        } else {
            res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});