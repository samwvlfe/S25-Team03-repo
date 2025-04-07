import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import axios from "axios";

const app = express();
const port = process.env.PORT || 2999;

// Middleware
app.use(express.json());
app.use(cors());

//import hash func
import {createHashPassword} from "../script/extra.js"
import { isValidPassword } from "../script/passwordComplexity.js";

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
    const { username, password } = req.body;

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
                usertype: user.UserType,
                companyID: user.CompanyID
            }
        });
    });
};

//update new password 
app.post('/api/update-password', async (req, res) => {
    const { u_table, username, newPassword } = req.body;

    // make sure all parameters are there
    if (!u_table || !username || !newPassword) {
        return res.status(400).json({ error: 'Table, username, and new password must be provided.' });
    }
    //make sure passwords fits complexity requirements
    if(!isValidPassword(newPassword)){
        return res.status(400).json({ error: 'Password must have at least 6 charaters and 1 digit' });
    }

    try {
        // Hash the new password 
        const hashedPassword = await createHashPassword(newPassword);

        // Stored procedure query
        const query = `CALL Password_Change(?, ?, ?)`;

        db.query(query, [u_table, username, hashedPassword], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            if (!results || results.affectedRows === 0) {
                return res.status(400).json({ error: 'User not found or password update failed.' });
            }
            // success
            res.status(200).json({ success: true, message: 'Password updated successfully' });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// get users
app.get('/api/get-users', async (req, res) => {
    const dQuery = 'SELECT DriverID, Username, Name, CompanyID, UserType FROM Driver';
    const sQuery = 'SELECT SponsorUserID, Username, CompanyID, UserType FROM SponsorUser';
    const aQuery = 'SELECT AdminID, Username, UserType FROM Admin';

    db.query(dQuery, (err, drivers) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed', details: err });
        } else {
            db.query(sQuery, (err, sponsors) => {
                db.query(aQuery, (err, admins) => {
                    const mergedData = [...drivers, ...sponsors, ...admins];
                    res.json(mergedData);
                })
            })
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
            INSERT INTO ?? (Name, Username, Email, PasswordHash, UserType, CompanyID, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [userType, name, username, email, hashedPassword, userType, companyID || null], (err, result) => {
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
app.delete('/api/admin/delete-user/:userType/:id', (req, res) => {
    const { userType, id: userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const allowedTables = {
        Driver: 'DriverID',
        SponsorUser: 'SponsorUserID',
        Admin: 'AdminID'
    };

    const idColumn = allowedTables[userType];

    if (!idColumn) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    const query = `DELETE FROM ?? WHERE ?? = ?`;

    db.query(query, [userType, idColumn, userId], (err, result) => {
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

app.get('/api/fake-store', async (req, res) => {
    try {
        // Fetch from fakestoreapi.com
        const apiResponse = await axios.get('https://fakestoreapi.com/products');
        const fakeStoreProducts = apiResponse.data.map(product => ({
          ProductID: product.id,
          ProductName: product.title,
          PriceInPoints: Math.round(product.price),
          ImageURL: product.image,
          Source: "FakeStore"
        }));
    
        // Fetch form database
        db.query('SELECT ProductID, ProductName, PriceInPoints, ImageURL FROM ProductCatalog WHERE Availability = TRUE', (err, dbProducts) => {
          if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
          }
    
          const localProducts = dbProducts.map(p => ({
            ProductID: p.ProductID,
            ProductName: p.ProductName,
            PriceInPoints: p.PriceInPoints,
            ImageURL: p.ImageURL,
            Source: "Local"
          }));
    
          // Return both catalogs
          const combined = [...localProducts, ...fakeStoreProducts];
          res.json(combined);
        });
      } catch (error) {
        console.error("Error fetching from FakeStore:", error);
        res.status(500).json({ error: "Failed to fetch store products", details: error.message });
      }
});

app.post('/api/create-product', (req, res) => {
    const { productName, priceInPoints, description, imageURL } = req.body;
  
    if (!productName || !priceInPoints) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `
      INSERT INTO ProductCatalog (ProductName, PriceInPoints, Description, ImageURL)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(query, [productName, priceInPoints, description || null, imageURL || null], (err, result) => {
      if (err) {
        console.error("Failed to insert product:", err);
        return res.status(500).json({ error: 'Database insert failed', details: err.message });
      }
      res.status(201).json({ message: 'Product created successfully', productID: result.insertId });
    });
  });

  app.post('/api/products', (req, res) => {
    const { productName, priceInPoints, description, imageURL } = req.body;
  
    if (!productName || !priceInPoints) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `
      INSERT INTO ProductCatalog (ProductName, PriceInPoints, Description, ImageURL)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(query, [productName, priceInPoints, description || null, imageURL || null], (err, result) => {
      if (err) {
        console.error("Insert failed:", err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
  
      res.status(201).json({ message: 'Product added', productID: result.insertId });
    });
  });  

// get points from driver table based on driver ID
app.get('/getTotalPoints', (req, res) => {
    const { driverID } = req.query;

    if (!driverID) {
        return res.status(400).json({ error: 'Driver ID is required' });
    }

    db.query(
        'SELECT TotalPoints FROM Driver WHERE DriverID = ?',
        [driverID],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }

            if (results.length > 0) {
                res.status(200).json({ totalPoints: results[0].TotalPoints });
            } else {
                res.status(404).json({ error: 'Driver not found' });
            }
        }
    );
});

// change points by Driver ID 
app.post('/updatePoints', (req, res) => {
    const { userDriverID, Points_inc, EditorUserID, reason } = req.body; 

    if (!userDriverID || !Points_inc || !EditorUserID || !reason) {
        return res.status(400).json({ error: 'All parameters are required' });
    }

    db.query(
        'CALL PointChange(?, ?, ?, ?)', // Call the stored procedure
        [parseInt(userDriverID), parseInt(Points_inc), parseInt(EditorUserID), reason], // Convert to integers
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }

            res.status(200).json({ message: 'Stored procedure executed successfully', results });
        }
    );
});

// // show point log based on current DriverID
app.get('/pointHistory/', (req, res) => {

    const { driverID } = req.query;

    if (!driverID) {
        return res.status(400).json({ error: 'Cannot access Driver ID' });
    }

    // Query the table for all rows that match driverID
    db.query(
        'SELECT * FROM GoodDriverIncentiveT3.PointHistory WHERE DriverID = ? ORDER BY TransactionID DESC',
        [driverID],
        (err, results) => {
            if(err){
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            if(results.length > 0){
                // return data as JSON
                res.status(200).json(results);
            } 
            else{
                res.status(404).json({ error: 'Driver not found' });
            }            
        }
    );
});

// process purchase
app.post('/api/purchase', (req, res) => {
    const { u_DriverID, u_CartPrice, uOrder } = req.body;
    // make sure parameters are there
    if (u_DriverID == null || u_CartPrice == null || !uOrder) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    // execute the stored procedure 
    db.query('CALL Buy_Sum(?, ?, ?)', [u_DriverID, u_CartPrice, uOrder], (error, results) => {
        if (error) {
            console.error('Error executing stored procedure:', error);
            return res.status(500).json({ error: 'Database error occurred.' });
        }
        res.json({ message: 'Purchase processed successfully.', results });
    });
});

// Add new company (Sponsor)
app.post('/api/add-company', (req, res) => {
    const { companyName, pointsInfo } = req.body;

    if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    const query = `
        INSERT INTO Sponsor (CompanyName, PointsInfo)
        VALUES (?, ?)
    `;

    db.query(query, [companyName, pointsInfo || null], (err, result) => {
        if (err) {
            console.error('Error inserting company:', err);
            return res.status(500).json({ error: 'Failed to add company', details: err });
        }

        res.status(201).json({ message: 'Company added successfully', companyID: result.insertId });
    });
});

//Gets sponsor companies
app.get('/api/get-sponsors', (req, res) => {
    db.query('SELECT CompanyID, CompanyName FROM Sponsor', (err, results) => {
        if (err) {
            console.error('Failed to fetch sponsors:', err);
            return res.status(500).json({ error: 'Failed to retrieve sponsors' });
        }
        res.status(200).json(results);
    });
});

//Submits sponsor request
app.post('/api/request-sponsor', (req, res) => {
    const { driverID, sponsorCompanyID } = req.body;

    if (!driverID || !sponsorCompanyID) {
        return res.status(400).json({ error: 'Missing driver ID or sponsor company ID' });
    }

    const query = `
        INSERT INTO DriverSponsorRequests (DriverID, SponsorCompanyID, RequestDate, Status)
        VALUES (?, ?, NOW(), 'Pending')
    `;

    db.query(query, [driverID, sponsorCompanyID], (err, result) => {
        if (err) {
            console.error('Sponsor request failed:', err);
            return res.status(500).json({ error: 'Failed to submit sponsor request' });
        }
        res.status(201).json({ message: 'Sponsor request submitted successfully' });
    });
});

// Get pending requests for sponsor company
app.get("/api/sponsor/driver-requests/:companyID", (req, res) => {
    const { companyID } = req.params;
  
    const query = `
      SELECT r.RequestID, r.DriverID, r.SponsorCompanyID, r.RequestDate, r.Status, d.Username
      FROM DriverSponsorRequests r
      JOIN Driver d ON r.DriverID = d.DriverID
      WHERE r.SponsorCompanyID = ? AND r.Status = 'Pending'
    `;
  
    db.query(query, [companyID], (err, results) => {
      if (err) return res.status(500).json({ error: "Query failed", details: err });
      res.json(results);
    });
  });
  
  // Approve or reject request
  app.post("/api/sponsor/handle-request", (req, res) => {
    const { requestID, driverID, decision } = req.body;
  
    const updateRequestQuery = `
      UPDATE DriverSponsorRequests SET Status = ? WHERE RequestID = ?
    `;
  
    const updateDriverQuery = `
      UPDATE Driver SET CompanyID = (
        SELECT SponsorCompanyID FROM DriverSponsorRequests WHERE RequestID = ?
      ) WHERE DriverID = ?
    `;
  
    db.query(updateRequestQuery, [decision, requestID], (err) => {
      if (err) return res.status(500).json({ error: "Failed to update request", details: err });
  
      if (decision === "Approved") {
        db.query(updateDriverQuery, [requestID, driverID], (err2) => {
          if (err2) return res.status(500).json({ error: "Failed to update driver", details: err2 });
          res.json({ message: "Driver approved and updated" });
        });
      } else {
        res.json({ message: "Request rejected" });
      }
    });
  });
  

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});