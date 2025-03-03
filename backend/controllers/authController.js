const { verifySponsorLogin } = require('../models/userModel');

const userLogin = (req, res) => {
    console.log("Received login request:", req.body);

    const { Username, password } = req.body;

    if (!Username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    verifySponsorLogin(Username, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message || 'Database error' });
        }

        if (!result || !result.success) {
            return res.status(401).json({ error: result ? result.message : 'Login failed' });
        }

        res.status(200).json(result);
    });
};

module.exports = { userLogin }; 



