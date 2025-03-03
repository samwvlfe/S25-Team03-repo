const express = require('express');
const { userLogin } = require('../controllers/authController'); 

const router = express.Router();

router.post('/login', userLogin);

module.exports = router;

