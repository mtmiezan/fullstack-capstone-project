const express = require('express');
const router = express.Router();
const connectToDatabase = require("../models/db");
const logger = require('../logger');
const collectionName = 'gifts';

// Get all gifts
router.get('/', async (req, res,next) => {
      logger.info('called get alml gifts');
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
         const db = await connectToDatabase();

        // Task 2: use the collection() method to retrieve the gift collection
        const collection = db.collection(collectionName);

        // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray();

        // Task 4: return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        logger.console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
        next(e);
    }
});

//Get a single gift by ID
router.get('/:id', async (req, res, next) => {
    logger.info('called get a single gift by ID');
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
         const db = await connectToDatabase();

        // Task 2: use the collection() method to retrieve the gift collection
        const collection = db.collection(collectionName);

        const id = req.params.id;

        // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
        const gift = await collection.findOne({id:id})

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        logger.console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
        next(e);
    }
});



// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collectionName);
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
