const express = require('express');
const { loginController } = require('../controllers/login.controller.js');
const router = express.Router();

router.post('/', loginController);

module.exports = router;
