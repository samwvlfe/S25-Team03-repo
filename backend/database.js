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
app.post('/api/submit-application', async (req, res) => {
    const { applicantName, applicantType, username, email, password, companyID } = req.body;

    if (!applicantName || !applicantType || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing it

        let query;
        let values;

        if (applicantType === 'Admin') {
            if (!adminID) {
                return res.status(400).json({ error: 'Admin ID is required for admin accounts' });
            }
            query = `
                INSERT INTO Applications (ApplicantName, ApplicantType, Username, Email, PasswordHash, AdminID, ApplicationStatus, SubmissionDate)
                VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
            `;
            values = [applicantName, applicantType, username, email, hashedPassword, adminID];
        } else {
            query = `
                INSERT INTO Applications (ApplicantName, ApplicantType, Username, Email, PasswordHash, CompanyID, ApplicationStatus, SubmissionDate)
                VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())
            `;
            values = [applicantName, applicantType, username, email, hashedPassword, companyID || null];
        }

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Database insert failed:', err);
                return res.status(500).json({ error: 'Database insert failed', details: err.sqlMessage });
            }
            res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
        });

    } catch (error) {
        res.status(500).json({ error: 'Password hashing failed', details: error.message });
    }
});

app.post('/api/admin/verify', (req, res) => {
    const { adminID } = req.body;

    if (!adminID) {
        return res.status(400).json({ error: 'AdminID is required' });
    }

    const query = `SELECT * FROM Admins WHERE AdminID = ?`;

    db.query(query, [adminID], (err, result) => {
        if (err) {
            console.error('Admin verification failed:', err);
            return res.status(500).json({ error: 'Database error', details: err.sqlMessage });
        }

        if (result.length === 0) {
            return res.status(403).json({ error: 'Invalid AdminID' });
        }

        res.status(200).json({ message: 'Admin verified', admin: result[0] });
    });
});

app.post('/api/admin/create-user', async (req, res) => {
    const { name, username, email, password, role, companyID } = req.body;

    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Users (Name, Username, Email, PasswordHash, Role, CompanyID, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [name, username, email, hashedPassword, role, companyID || null], (err, result) => {
            if (err) {
                console.error('User creation failed:', err);
                return res.status(500).json({ error: 'User creation failed', details: err.sqlMessage });
            }
            res.status(201).json({ message: 'User created successfully', id: result.insertId });
        });

    } catch (error) {
        res.status(500).json({ error: 'Password hashing failed', details: error.message });
    }
});

app.delete('/api/admin/delete-user/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = `DELETE FROM Users WHERE ID = ?`;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('User deletion failed:', err);
            return res.status(500).json({ error: 'User deletion failed', details: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});