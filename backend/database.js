import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT || 2999;

// Middleware
app.use(express.json());
app.use(cors());

//import hash func
import {createHashPassword} from "../script/extra.js"

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

// Update Application Status and move to respective tables
app.post('/api/update-application-status', async (req, res) => {
    const { applicationID, status } = req.body;
    console.log(`Processing application ID=${applicationID}, Status=${status}`);

    if (!applicationID || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (status === 'Rejected') {
        const deleteQuery = `DELETE FROM Applications WHERE ApplicationID = ?`;
        db.query(deleteQuery, [applicationID], (err, result) => {
            if (err) {
                console.error('Error deleting rejected application:', err);
                return res.status(500).json({ error: 'Failed to delete application', details: err });
            }
            return res.status(200).json({ message: 'Application rejected and removed successfully' });
        });
    } else if (status === 'Approved') {
        console.log(` Fetching application details for ID=${applicationID}`);
        const selectQuery = `SELECT * FROM Applications WHERE ApplicationID = ?`;
        db.query(selectQuery, [applicationID], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).json({ error: 'Application not found', details: err });
            }

            const application = results[0];
            const { ApplicantName, ApplicantType, Username, Email, PasswordHash, CompanyID } = application;
            console.log(`Application found:`, application);

            let insertUserQuery;
            let userValues;
            let insertAllUsersQuery = `
                INSERT INTO AllUsers (Username, Email, PasswordHash, UserType, Name, TotalPoints, CompanyID)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            let allUsersValues = [Username, Email, PasswordHash, ApplicantType, ApplicantName, ApplicantType === 'Driver' ? 0 : null, CompanyID || null];

            if (ApplicantType === 'Driver') {
                insertUserQuery = `
                    INSERT INTO Driver (Username, PasswordHash, Name, TotalPoints, CompanyID)
                    VALUES (?, ?, ?, 0, ?)
                `;
                userValues = [Username, PasswordHash, ApplicantName, CompanyID || null];
            } else if (ApplicantType === 'Sponsor') {
                insertUserQuery = `
                    INSERT INTO SponsorUser (Username, PasswordHash, CompanyID)
                    VALUES (?, ?, ?)
                `;
                userValues = [Username, PasswordHash, CompanyID || null];
            } else if (ApplicantType === 'Admin') {
                insertUserQuery = `
                    INSERT INTO Admin (Username, PasswordHash)
                    VALUES (?, ?)
                `;
                userValues = [Username, PasswordHash];
            }

            console.log(`Running query:
${insertUserQuery}`);
            console.log(`With values:`, userValues);

            db.query(insertUserQuery, userValues, (err, result) => {
                if (err) {
                    console.error(` Error inserting into ${ApplicantType} table:`, err);
                    return res.status(500).json({ error: `Failed to insert into ${ApplicantType} table`, details: err });
                }
                console.log(` Successfully inserted into ${ApplicantType} table`);

                db.query(insertAllUsersQuery, allUsersValues, (err, result) => {
                    if (err) {
                        console.error(' Error inserting into AllUsers table:', err);
                        return res.status(500).json({ error: 'Failed to insert into AllUsers', details: err });
                    }
                    console.log(` Successfully inserted into AllUsers table`);

                    const deleteApplicationQuery = `DELETE FROM Applications WHERE ApplicationID = ?`;
                    db.query(deleteApplicationQuery, [applicationID], (err, result) => {
                        if (err) {
                            console.error(' Error deleting application:', err);
                            return res.status(500).json({ error: 'Failed to delete application', details: err });
                        }
                        console.log(` Application ${applicationID} moved and deleted successfully.`);
                        return res.status(200).json({ message: `Application approved and moved to ${ApplicantType} table.` });
                    });
                });
            });
        });
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
    const { applicantName, applicantType, username, email, password, companyID, adminID } = req.body; // FIX: Extract adminID

    if (!applicantName || !applicantType || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await createHashPassword(password);

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
});

// log in
app.post('/api/login', async (req, res) => {
    const { username, password} = req.body;

    console.log(username);
    console.log(password);


    if (!username || !password) {
        return res.status(400).json({ error: 'Username and/or password not sent in request' });
    }
    try{



        verifyLogin(username, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
    
            if (!result || !result.success) {
                return res.status(401).json({ error: result ? result.message : 'Login failed' });
            }

            const user = result.user;
            // Use bcrypt.compare to verify the plaintext password
            const isMatch = await bcrypt.compare(password, user.pass);
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }

});

// Function to Call Stored Procedure and Verify Password
const verifyLogin = (Username, callback) => {
    const query = `CALL Log_In(?)`;
    db.query(query, [Username], (err, results) => {
        if (err) {
            return callback({ success: false, message: err.message || 'Failed login' });
        }

        if (!results || results.length === 0 || results[0].length === 0) {
            return callback(null, { success: false, message: 'Incorrect Username/Password' });
        }

        const user = results[0][0];
        
        return callback(null, {
            success: true,
            message: 'Login successful',
            user: {
                id: user.UserID,   
                username: user.Username,
                pass: user.PasswordHash,
                usertype: user.UserType
            }
        });
    });
};

app.get('/api/get-users', async (req, res) => {
    const query = await db.execute('SELECT UserID, Name, Username, Email, UserType, CompanyID FROM AllUsers WHERE UserType IN ("Driver", "Sponsor")');

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed', details: err });
        } else {
            res.json(results);
        }
    });
});

// admin add user
app.post('/api/admin/create-user', async (req, res) => {
    const { name, username, email, password, userType, companyID } = req.body;

    if (!name || !username || !email || !password || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO AllUsers (Name, Username, Email, PasswordHash, UserType, CompanyID, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [name, username, email, hashedPassword, userType, companyID || null], (err, result) => {
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

    const query = `DELETE FROM AllUsers WHERE UserID = ?`;

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