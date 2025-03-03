// manages the database connection

const mysql = require('mysql2');

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

module.exports = db;