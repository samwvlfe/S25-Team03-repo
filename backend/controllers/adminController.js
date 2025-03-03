// handles login logic (basically .h file for userModels)


const { createUser, deleteUser } = require('../models/userModel');

const createAdminUser = (req, res) => {
    createUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: 'User creation failed', details: err.message });
        res.status(201).json(result);
    });
};

const deleteAdminUser = (req, res) => {
    const { id } = req.params;

    deleteUser(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'User deletion failed', details: err.message });
        res.status(result.success ? 200 : 404).json(result);
    });
};

module.exports = { createAdminUser, deleteAdminUser };
