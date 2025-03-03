// handles database operations

const db = require('../config/dbConfig');
const bcrypt = require('bcrypt');


// verify user for login by calling stored procedure
const verifySponsorLogin = (username, password, callback) => {
    const query = `CALL VerifySponsorLogin(?)`;

    db.query(query, [username], (err, results) => {
        if (err) {
            return callback({ success: false, message: err.message || 'Login failed' });
        }

        if (!results || results.length === 0 || results[0].length === 0) {
            return callback(null, { success: false, message: 'User not found' });
        }

        const user = results[0][0]; // Extract user data

        if (password !== user.storedPassword) {
            return callback(null, { success: false, message: 'Incorrect password' });
        }

        return callback(null, {
            success: true,
            message: 'Login successful',
            user: {
                id: user.SponsorUserID,
                username: user.Username,
                email: user.Email,
                companyID: user.CompanyID,
                usertype: user.UserType
            }
        });
    });
};

// Create User
const createUser = async (userData, callback) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const query = `
            INSERT INTO Users (Name, Username, Email, PasswordHash, Role, CompanyID, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        db.query(query, [userData.name, userData.username, userData.email, hashedPassword, userData.role, userData.companyID || null], 
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, { success: true, message: 'User created successfully', id: result.insertId });
            });
    } catch (error) {
        callback(error, null);
    }
};

// Delete User
const deleteUser = (userId, callback) => {
    const query = `DELETE FROM Users WHERE ID = ?`;

    db.query(query, [userId], (err, result) => {
        if (err) return callback(err, null);
        if (result.affectedRows === 0) return callback(null, { success: false, message: 'User not found' });

        callback(null, { success: true, message: 'User deleted successfully' });
    });
};

module.exports = { verifySponsorLogin, createUser, deleteUser };
