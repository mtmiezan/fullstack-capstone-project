//Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationRseult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
const collectionName = 'users'
//Step 1 - Task 3: Create a Pino logger instance
const looger = pino();

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection(collectionName);

        const { email, firstName, lastName } = req.body;
        //Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: email });

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // {{insert code here}} //Task 4: Save user details in database

        if (existingEmail) {
            return res.status(404).send('User already registered');
        }
        const newUser = await collection.insertOne({
            email,
            firstName,
            lastName,
            password: hash,
            createdAt: new Date(),
        });
        // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        }
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({ authtoken, email });

    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;