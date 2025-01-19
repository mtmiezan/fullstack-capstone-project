//Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResu } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
const collectionName = 'users'
//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

dotenv.config();

//Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
//Login endpoint
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const collection = db.collection(collectionName);
        // Task 3: Check for user credentials in database
        const theUser = await collection.findOne({email: req.body.email});
        // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
        if(theUser){
            let result = await bcryptjs.compare(req.body.password, theUser.password);
            if(!result){
                logger.error('passwords do not macth');
                return res.status(404).json({ error: 'wrong password' });
            }
             // Task 5: Fetch user details from database
            const { _id:userID,firstName:userName, email:userEmail } = theUser;
              // Task 6: Create JWT authentication if passwords match with user._id as payload
            let payload = {
                user: {
                    id: userID.toString(),
                }
            }
           const authtoken = jwt.sign(payload, JWT_SECRET);
           logger.info('User logged in successfully');
           res.json({authtoken, userName, userEmail });
        }
        else{
            logger.error('User not found');
            res.status(404).json({ error: 'User not found'});
        }
            
        // Task 7: Send appropriate message if user not found
    } catch (e) {
         return res.status(500).send('Internal server error');

    }
});

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection(collectionName);

        const { email, firstName, lastName, password } = req.body;
        //Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        // {{insert code here}} //Task 4: Save user details in database

        // if (existingEmail) {
        //     return res.status(404).send('User already registered');
        // }
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