const express = require('express');
const db = require('../config/dbConfig');

const router = express.Router();
const aboutTable = 'AboutPage';

// Get the latest about page data
router.get('/about', (req, res) => {
    db.query(`SELECT * FROM ${aboutTable} ORDER BY release_date DESC LIMIT 1`, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Database query failed', details: err });
        }
        console.log('API Response:', results); 
        res.json(results[0]); 
    });
});


// Add new about page data
router.post('/about', (req, res) => {
    const { team_number, version_number, release_date, product_name, product_description } = req.body;
    const query = `
        INSERT INTO ${aboutTable} (team_number, version_number, release_date, product_name, product_description)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert failed', details: err });
        }
        res.status(201).json({ message: 'About page updated successfully', id: result.insertId });
    });
});

// Update existing about page data
router.put('/about/:id', (req, res) => {
    const id = req.params.id;
    const { team_number, version_number, release_date, product_name, product_description } = req.body;
    const query = `
        UPDATE ${aboutTable}
        SET team_number=?, version_number=?, release_date=?, product_name=?, product_description=?
        WHERE id=?
    `;

    db.query(query, [team_number, version_number, release_date, product_name, product_description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database update failed', details: err });
        }
        res.json({ message: 'About page data updated successfully' });
    });
});

module.exports = router;
