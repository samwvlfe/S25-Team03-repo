const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 2999;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection - TEST
// const db = mysql.createConnection({
//     host: 't3db-instance.cmypylkqlfup.us-east-1.rds.amazonaws.com',
//     user: 't3admin',
//     password: 'JlziWBbT4LmgEEbJsCwW',
//     database: 'GoodDriverIncentiveT3',
//     port: 3306
// });

// Database connection - PRODUCTION
const db = mysql.createConnection({
    host: 'cpsc4911.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '4911Admin2025',
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

// Fetch applications (Pending Only)
app.get('/api/get-applications', (req, res) => {
    const query = `SELECT * FROM Applications WHERE ApplicationStatus = 'Pending'`;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed', details: err });
        } else {
            res.json(results);
        }
    });
});

// Update Application Status
app.post('/api/update-application-status', (req, res) => {
    const { applicationID, status } = req.body;
    
    if (!applicationID || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `UPDATE Applications SET ApplicationStatus = ? WHERE ApplicationID = ?`;
    db.query(query, [status, applicationID], (err, result) => {
        if (err) {
            console.error('Error updating application status:', err);
            res.status(500).json({ error: 'Database update failed', details: err });
        } else {
            res.status(200).json({ message: `Application ${status} successfully` });
        }
    });
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
    const { applicantName, applicantType, username, email, password, companyID, adminID } = req.body; // FIX: Extract adminID

    if (!applicantName || !applicantType || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

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

        console.log('Executing Query:', query);
        console.log('With Values:', values);

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

// log in
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // #############HERE
    console.log("Request:", req.body); 

    if (!username || !password) {
        return res.status(400).json({ error: 'Usernamd and/or password not sent in request' });
    }

    verifyLogin(username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (!result || !result.success) {
            return res.status(401).json({ error: result ? result.message : 'Login failed' });
        }

        res.status(200).json(result);
    });
});

// Function to Call Stored Procedure and Verify Password
const verifyLogin = (Username, password, callback) => {
    const query = `CALL VerifySponsorLogin(?, ?)`;
    db.query(query, [Username, password], (err, results) => {
        if (err) {
            return callback({ success: false, message: err.message || 'Failed login' });
        }

        if (!results || results.length === 0 || results[0].length === 0) {
            return callback(null, { success: false, message: 'Stored procedure deemed incorrect username and/or password' });
        }

        const user = results[0][0];
        
        return callback(null, {
            success: true,
            message: 'Login successful',
            user: {
                id: user.UserID,   
                username: user.Username,
                usertype: user.UserType
            }
        });
    });
};



// admin add user
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
                return res.status(500).json({ error: 'User creation failed', details: err.message });
            }
            res.status(201).json({ message: 'User created successfully', id: result.insertId });
        });

    } catch (error) {
        res.status(500).json({ error: 'Password hashing failed', details: error.message });
    }
});

// admin delete user
app.delete('/api/admin/delete-user/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = `DELETE FROM Users WHERE ID = ?`;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('User deletion failed:', err);
            return res.status(500).json({ error: 'User deletion failed', details: err.message });
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