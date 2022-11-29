const router = require('express').Router();
const Watch = require('../models/Watch');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('The file has to be an image'));
        }

        cb(undefined, true);
    }
});

/**
 * GET request 
 */
router.get('', async (req, res) => {
    const foundWatches = await Watch.find(req.query, { image: 0 });

    res.status(StatusCodes.OK).send(foundWatches);
});

/**
 * POST request
 */
router.post('/addProduct', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
    const newWatch = new Watch({
        brand: req.body.brand,
        model: req.body.model,
        description: req.body.description,
        price: req.body.price,
        dialInformation: {
            dialColor: req.body.dialInformation.dialColor,
            crystal: req.body.dialInformation.crystal,
            dialType: req.body.dialInformation.crystal,
        },
    });

    try {
        const savedWatch = await newWatch.save();

        res.status(StatusCodes.OK).send(savedWatch);
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).send(err);

    }
});

/**
 * PUT request
 */
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedWatch = Watch.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            },
            { new: true }
        );

        res.status(StatusCodes.OK).send(updatedWatch);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(err);
    }
    
});

/**
 * DELETE request
 */
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Watch.findByIdAndDelete(req.params.id);

        res.status(StatusCodes.OK).send(`Watch with id ${req.params.id} has been successfully deleted`);
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(err);
    }
    
});

module.exports = router;