const router = require("express").Router();
const Watch = require("../models/Watch");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");

const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error("The file has to be an image"));
        }

        cb(undefined, true);
    }
});

/**
 * GET image from records
 */
router.get("/:id/image", async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);

        if (!watch) {
            throw new Error("There is no product with id: " + req.params.id);
        } else if (!watch.image) {
            throw new Error("This product does not have an image");
        }

        res.set("Content-Type", "image/png");
        res.status(StatusCodes.OK).send(watch.image);

    } catch (error) {
        res.status(StatusCode.BAD_REQUEST).send(error);
    }
})

/**
 * POST image to a product record
 */
 router.post("/addImage", isAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const watch = await Watch.findById(req.body.id);
        watch.image = req.file.buffer;
        await watch.save();

        res.status(StatusCodes.OK).send({image: 0, ...watch});
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
    }
}, (error, req, res, next) => {
    res.status(StatusCodes.BAD_REQUEST).send({error: error.message});
});

/**
 * DELETE image from records
 */
router.delete("/deleteImage", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const watch = await Watch.findById(req.body.id);
        watch.image = undefined;
        await watch.save();
        res.status(StatusCodes.OK).send("Image has been successfully removed");
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
    }
});

module.exports = router;