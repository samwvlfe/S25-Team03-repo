const express = require('express');
const { createAdminUser, deleteAdminUser } = require('../controllers/adminController');

const router = express.Router();

router.post('/admin/create-user', createAdminUser);
router.delete('/admin/delete-user/:id', deleteAdminUser);

module.exports = router;
