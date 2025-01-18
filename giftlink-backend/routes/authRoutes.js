//Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationRseult} = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
//Step 1 - Task 3: Create a Pino logger instance
const looger = pino();

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
//Step 2
});

module.exports = router;